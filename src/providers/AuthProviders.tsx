// AuthProvider.tsx

import { useEffect, useState, ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import NavBar from "../components/navbar";
import { NavbarProvider } from "./NavbarContext";

const AuthProvider = ({
  ProtectedPage,
}: {
  ProtectedPage: ReactNode;
}): ReactNode => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.userState.userState.isAuthenticated
  );
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    setCanRender(isAuthenticated);
  }, [isAuthenticated]);

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
