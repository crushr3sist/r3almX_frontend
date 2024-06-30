import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../components/navbar";
import { NavbarProvider } from "./NavbarContext";
import axios from "axios";

const token = localStorage.getItem("token");
const verifyToken = (token) => {
  return axios.get(`http://10.1.1.207:8000/auth/token/check`, {
    params: { token },
  });
};

const userVerified = await verifyToken(token);

const AuthProvider = ({ ProtectedPage }: any) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [canRender, allowRender] = useState<boolean>(false);

  useEffect(() => {
    if (token === null) {
      console.log("user's token isnt true");
      navigate("/auth/login");
      allowRender(false);
    }
    // if (userVerified.data.is_user_logged_in === false) {
    //   navigate("/auth/login");
    //   allowRender(false);
    // }
    else if (location.pathname === "/" && token === null) {
      navigate("/auth/login");
      allowRender(false);
    } else {
      allowRender(true);
    }
  }, [location]);

  if (canRender) {
    return (
      <div>
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
