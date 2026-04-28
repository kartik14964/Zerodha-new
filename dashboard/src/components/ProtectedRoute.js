import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Set your dynamic URL based on environment variables
  const loginUrl = process.env.REACT_APP_AUTH_URL || "http://localhost:3001/";
  
  // Wrap in useCallback so it can be safely used in the event listener
  const checkAuth = useCallback(async () => {
    setIsChecking(true); // Force the loading screen to appear immediately
    try {
      // NOTE: Ensure this URL points to your deployed backend when in production!
      const { data } = await axios.get("http://localhost:3002/me", {
        withCredentials: true,
      });

      if (data.loggedIn) {
        setIsAuthenticated(true);
        setIsChecking(false);
      } else {
        window.location.replace(loginUrl); // Use .replace() so they can't go "forward" again
      }
    } catch (err) {
      window.location.replace(loginUrl);
    }
  }, [loginUrl]);

  useEffect(() => {
    // 1. Run the check normally when the component first mounts
    checkAuth();

    // 2. THE BF-CACHE FIX: Listen for the "Back" button
    const handlePageShow = (event) => {
      // event.persisted is TRUE if the browser loaded the page from the Back/Forward cache
      if (event.persisted) {
        checkAuth(); // Force the security check to run again
      }
    };

    window.addEventListener("pageshow", handlePageShow);

    // Cleanup the listener when the component unmounts
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [checkAuth]);

  if (isChecking) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20vh" }}>
        <h2>Loading securely...</h2>
      </div>
    );
  }

  return isAuthenticated ? children : null;
};

export default ProtectedRoute;
