// NavbarContext.js
import { createContext, useState } from "react";

export const NavbarContext = createContext();

export const NavbarProvider = ({ children }) => {
  const [headerValue, setHeaderValue] = useState(0);

  return (
    <NavbarContext.Provider value={{ headerValue, setHeaderValue }}>
      {children}
    </NavbarContext.Provider>
  );
};
