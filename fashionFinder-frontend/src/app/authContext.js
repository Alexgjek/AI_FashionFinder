import React, { createContext, useState, useContext } from 'react';
import { SessionProvider } from "next-auth/react"; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false); 
  
  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, showModal, setShowModal }}>
      <SessionProvider>
        {children}
      </SessionProvider>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);