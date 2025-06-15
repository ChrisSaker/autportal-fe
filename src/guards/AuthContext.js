import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (data) => {
    const user = data.user;
    const userId = user.user_role === "student" ? user.student_id : user.id;

    localStorage.setItem("token", data.token);
    localStorage.setItem("role", user.user_role);
    localStorage.setItem("id", userId);

    if (user.profile_url) {
      localStorage.setItem("profile_url", user.profile_url);
    }
    else {
      localStorage.setItem("profile_url",null);
    }

    const firstName = user.first_name;
    const lastName = user.last_name;
    const fullName =
      firstName && lastName ? `${firstName} ${lastName}` : user.name;

    localStorage.setItem("name", fullName);

    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("id");
    localStorage.removeItem("profile_url");
    localStorage.removeItem("name");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
