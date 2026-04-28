import React, { useEffect, useState } from "react";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const { data } = await axios.get("https://zerodha-mdj3.onrender.com/me", {
          withCredentials: true,
        });

        if (data.loggedIn) {
          setIsAuthenticated(true);
        } else {
          window.location.replace("https://zerodha-frontend-cgha.onrender.com/login");
        }
      } catch (err) {
        window.location.replace("https://zerodha-frontend-cgha.onrender.com/login");
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
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h3>Verifying Session...</h3>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
