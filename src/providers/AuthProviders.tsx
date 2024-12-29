import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../components/navbar";
import { NavbarProvider } from "./NavbarContext";
import { logOff } from "@/components/logOff";

const AuthProvider = ({ ProtectedPage }: any) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [canRender, allowRender] = useState<boolean>(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token === "" || token === null || token === undefined) {
      console.error("user's token isnt true");
      allowRender(false);
      logOff()
      navigate("/auth/login");
    } else {
      allowRender(true);
    }
  }, [location]);

  if (canRender) {
    return (
      <div className="grain-bg">
        <NavbarProvider>
          {ProtectedPage}
          <NavBar />
        </NavbarProvider>
      </div>
    );
  } else {
    return null;
  }
};

export default AuthProvider;
