import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const withSessionCheck = (WrappedComponent) => {
  return function WithSessionCheck(props) {
    const navigate = useNavigate();

    const checkLoginStatus = async () => {
      try {
        const response = await axios.get(
          "http://localhost/Backend/Auth/cekLogin.php",
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (
          response.data.status === "expired" ||
          response.data.status === "no_session"
        ) {
          console.log("Session ended, logging out...");
          sessionStorage.clear();
          navigate("/login");
        }
      } catch (error) {
        console.error("Session check error:", error);
      }
    };

    useEffect(() => {
      const loginChecker = setInterval(checkLoginStatus, 2000);
      checkLoginStatus(); // Initial check

      return () => clearInterval(loginChecker);
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default withSessionCheck;
