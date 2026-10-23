import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { readStorage, writeStorage, removeStorage } from "../utils/storage";

const AuthContext = createContext(null);
const USERS_KEY = "nexora_demo_users";
const SESSION_KEY = "nexora_demo_session";

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => readStorage(USERS_KEY, []));
  const [user, setUser] = useState(() => readStorage(SESSION_KEY, null));

  const register = useCallback(({ name, email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (users.some((u) => u.email === normalizedEmail)) throw new Error("An account with this email already exists.");
    const newUser = { id: crypto.randomUUID?.() || String(Date.now()), name: name.trim(), email: normalizedEmail, password };
    const next = [...users, newUser];
    setUsers(next); writeStorage(USERS_KEY, next);
    const session = { id: newUser.id, name: newUser.name, email: newUser.email };
    setUser(session); writeStorage(SESSION_KEY, session);
    return session;
  }, [users]);

  const login = useCallback(({ email, password }) => {
    const found = users.find((u) => u.email === email.trim().toLowerCase() && u.password === password);
    if (!found) throw new Error("Email or password is incorrect.");
    const session = { id: found.id, name: found.name, email: found.email };
    setUser(session); writeStorage(SESSION_KEY, session);
    return session;
  }, [users]);

  const updateProfile = useCallback(({ name }) => {
    if (!user) return;
    const updatedUser = { ...user, name: name.trim() };
    const next = users.map((u) => u.id === user.id ? { ...u, name: updatedUser.name } : u);
    setUsers(next); writeStorage(USERS_KEY, next);
    setUser(updatedUser); writeStorage(SESSION_KEY, updatedUser);
  }, [user, users]);

  const logout = useCallback(() => { setUser(null); removeStorage(SESSION_KEY); }, []);
  const value = useMemo(() => ({ user, isAuthenticated: Boolean(user), register, login, logout, updateProfile }), [user, register, login, logout, updateProfile]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
