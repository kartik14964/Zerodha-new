import { useEffect, useState } from "react";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [authState, setAuthState] = useState("PENDING");

  const loginUrl = "https://zerodha-frontend-cgha.onrender.com/login";

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get("https://zerodha-mdj3.onrender.com/me", {
          withCredentials: true,
        });

        if (data.loggedIn) {
          setAuthState("LOGGED_IN");
        } else {
          setAuthState("LOGGED_OUT");
          window.location.replace(loginUrl);
        }
      } catch (err) {
        setAuthState("LOGGED_OUT");
        window.location.replace(loginUrl);
      }
    };

    checkAuth();
  }, []);

  if (authState === "PENDING") {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff",
        }}
      >
        <img
          src="/media/images/logo.svg"
          alt="Loading..."
          style={{ width: "50px" }}
        />
      </div>
    );
  }

  return authState === "LOGGED_IN" ? children : null;
};

export default ProtectedRoute;
