import React, { useEffect, useState } from "react";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const { data } = await axios.get(
          "https://zerodha-mdj3.onrender.com/me",
          {
            withCredentials: true,
          },
        );

        if (data.loggedIn) {
          setIsAuthenticated(true);
        } else {
          // Redirect to frontend login page
          window.location.replace(
            "https://zerodha-frontend-h6i8.onrender.com/login",
          );
        }
      } catch (err) {
        console.error("Auth check error:", err);
        // Redirect to frontend login page on error
        window.location.location(
          "https://zerodha-frontend-h6i8.onrender.com/login",
        );
      }
    };

    verifyUser();
    const handlePageShow = (event) => {
      
      if (event.persisted) {
        verifyUser();
      }
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  if (isAuthenticated === null) {
    return <div className="text-center mt-5">Loading Kite...</div>;
  }

  return children;
};

export default ProtectedRoute;
