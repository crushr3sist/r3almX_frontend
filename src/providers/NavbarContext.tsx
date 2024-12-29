import { useContext } from "react";
import { NavbarContext, NavbarContextProps } from "./NavbarProvider";

export const useNavbarContext = (): NavbarContextProps => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error("useNavbarContext must be used within a NavbarProvider");
  }
  return context;
};
