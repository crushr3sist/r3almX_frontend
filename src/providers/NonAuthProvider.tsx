import { logOff } from "@/components/logOff";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoggedOutUserProvider = ({ Children }: any) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      navigate("/");
    } else if (token === null) {
      setIsAuthenticated(false);
    }
  }, [navigate]);

  if (
    !isAuthenticated ||
    token === "" ||
    token === null ||
    token === undefined
  ) {
    return <>{Children}</>;
  } else {
    {
      console.error("user's token isnt true");
      setIsAuthenticated(false);
      logOff();
      navigate("/auth/login");
    }
  }
};

export default LoggedOutUserProvider;
