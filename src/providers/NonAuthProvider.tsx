// LoggedOutUserProvider.tsx

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/state/store";

const LoggedOutUserProvider = ({ Children }: { Children: React.ReactNode }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.userState.userState.isAuthenticated
  );
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token || isAuthenticated) {
      setAuthenticated(true);
      navigate("/");
    } else {
      setAuthenticated(false);
    }
  }, [isAuthenticated, navigate]);

  if (!authenticated) {
    return <>{Children}</>;
  } else {
    navigate("/auth/login");
    return null;
  }
};

export default LoggedOutUserProvider;
