import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

// Types for authentication
export interface User {
  id: string;
  username: string;
  role: "admin" | "operator";
  email: string;
}

interface DecodedToken {
  sub: string;
  username: string;
  role: "admin" | "operator";
  email: string;
  exp: number;
}

// For demo purposes, we'll use localStorage
// In a real app, you'd want to use secure cookies and proper backend auth
export const AUTH_TOKEN_KEY = "ration_auth_token";
export const USER_KEY = "ration_user";

// Mock users for demo (in a real app, this would be validated against a backend)
const DEMO_USERS = [
  {
    username: "admin",
    password: "admin123", // In reality, this would be hashed
    role: "admin",
    email: "admin@example.com",
    id: "1"
  },
  {
    username: "operator",
    password: "operator123", // In reality, this would be hashed
    role: "operator",
    email: "operator@example.com",
    id: "2"
  }
];

export const login = async (username: string, password: string): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Find user by username
  const user = DEMO_USERS.find(u => u.username === username);
  
  // Check if user exists and password matches
  if (user && user.password === password) {
    // Create a mock token (in a real app, this would come from the backend)
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = 60 * 60; // 1 hour
    
    const tokenData = {
      sub: user.id,
      username: user.username,
      role: user.role as "admin" | "operator",
      email: user.email,
      exp: now + expiresIn,
      iat: now
    };
    
    // In a real app, this would be a JWT generated and signed by the backend
    const mockToken = btoa(JSON.stringify(tokenData));
    
    // Store auth data
    localStorage.setItem(AUTH_TOKEN_KEY, mockToken);
    localStorage.setItem(USER_KEY, JSON.stringify({
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email
    }));
    
    return true;
  }
  
  return false;
};

export const logout = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.location.href = "/";
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr) as User;
  } catch (e) {
    logout();
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) return false;
  
  try {
    // This would verify the token with your backend in a real app
    const decoded = JSON.parse(atob(token)) as DecodedToken;
    const currentTime = Math.floor(Date.now() / 1000);
    
    return decoded.exp > currentTime;
  } catch (e) {
    // If there's any error, consider the user not authenticated
    console.error("Error verifying token:", e);
    return false;
  }
};

export const hasRole = (role: "admin" | "operator"): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  
  if (role === "operator") {
    // Both admin and operator can do operator things
    return user.role === "admin" || user.role === "operator";
  }
  
  // Otherwise, exact role match is required
  return user.role === role;
};

export const useAuth = () => {
  return {
    user: getCurrentUser(),
    isAuthenticated: isAuthenticated(),
    hasRole,
    login,
    logout
  };
};

// For logging audit information
export const logAuditEvent = (action: string, details?: Record<string, any>): void => {
  const user = getCurrentUser();
  const timestamp = new Date().toISOString();
  
  const logEntry = {
    timestamp,
    user: user?.username || "anonymous",
    userId: user?.id || "anonymous",
    action,
    details: details || {}
  };
  
  // In a real app, this would be sent to a backend API
  console.log("AUDIT LOG:", logEntry);
  
  // For demo purposes, we'll store in localStorage
  const auditLogs = JSON.parse(localStorage.getItem("audit_logs") || "[]");
  auditLogs.push(logEntry);
  localStorage.setItem("audit_logs", JSON.stringify(auditLogs));
};
