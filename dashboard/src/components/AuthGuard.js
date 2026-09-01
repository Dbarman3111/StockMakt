import React, { useEffect, useState } from "react";

const AuthGuard = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch("http://localhost:3002/me", { 
          credentials: "include" 
        });
        
        if (!response.ok) {
          // Not authenticated - redirect immediately
          window.location.href = "http://localhost:3000/signup";
          return;
        }

        const data = await response.json();
        if (data?.user) {
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          // Invalid response - redirect
          window.location.href = "http://localhost:3000/signup";
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
        // Network error - redirect to login
        window.location.href = "http://localhost:3000/signup";
      }
    };

    verifyAuth();
  }, []);

  // Return nothing while checking - will redirect or show content
  if (isAuthenticated === null) {
    return null;
  }

  if (isAuthenticated === false) {
    return null;
  }

  return React.Children.map(children, (child) =>
    React.cloneElement(child, { user })
  );
};

export default AuthGuard;