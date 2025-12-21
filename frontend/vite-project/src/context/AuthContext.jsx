import { createContext, useState, useEffect } from "react";
import { login as loginApi } from "../api/authApi";



export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setUser({ token });
  }, []);

  const login = async (email, password) => {
    const res = await loginApi({ email, password });
    const token = res.data.token;
    if (!token) {
      throw new Error("No token received from server");
    }
    localStorage.setItem("token", token);
    setUser({ token });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user,setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
