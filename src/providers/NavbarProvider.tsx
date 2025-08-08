import React, { createContext, useState, useEffect, ReactNode } from "react";

export interface NavbarContextProps {
  isNavbarOpen: boolean;
  setIsNavbarOpen: (isOpen: boolean) => void;
}

const NavbarContext = createContext<NavbarContextProps | undefined>(undefined);

const NavbarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  useEffect(() => {
    const handleMouseEnter = () => setIsNavbarOpen(true);
    const handleMouseLeave = () => setIsNavbarOpen(false);

    const drawerTrigger = document.getElementById("drawer-trigger");
    if (drawerTrigger) {
      console.log("triggered");
      drawerTrigger.addEventListener("mouseenter", handleMouseEnter);
      drawerTrigger.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (drawerTrigger) {
        drawerTrigger.removeEventListener("mouseenter", handleMouseEnter);
        drawerTrigger.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <NavbarContext.Provider value={{ isNavbarOpen, setIsNavbarOpen }}>
      <div className="texture-background">{children}</div>
    </NavbarContext.Provider>
  );
};

export { NavbarContext, NavbarProvider };
