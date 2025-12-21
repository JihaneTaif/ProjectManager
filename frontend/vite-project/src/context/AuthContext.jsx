import { createContext, useState, useEffect } from "react";
import { login as loginApi } from "../api/authApi";



export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    if (token) setUser({ token, email });
  }, []);

  const login = async (emailInput, password) => {
    const res = await loginApi({ email: emailInput, password });
    const token = res.data.token;
    const email = res.data.email;
    if (!token) {
      throw new Error("No token received from server");
    }
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
    setUser({ token, email });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
