import React, { createContext, useContext, useState } from 'react';

import authService from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const storedUser = authService.getCurrentUser();
  const baseDummyData = {
    phone: "+00 000 000 0000",
    location: "City, Country",
    headline: "Aspiring Cloud and DevOps Engineer",
    profileImage: "", 
    linkedin: "linkedin.com/in/student",
    github: "github.com/student",
    profileStrength: 85,
    summary: "Computer Science senior with a passion for cloud infrastructure and automation. Experienced in building scalable microservices and implementing CI/CD pipelines.",
    resumeScore: 92,
    atsScore: 88,
    resumeUpdateDate: "Oct 24, 2026",
  };

  const [currentUser, setCurrentUser] = useState(storedUser ? { ...baseDummyData, ...storedUser } : null);

  const logout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      authService.logout();
      sessionStorage.clear();
      setCurrentUser(null);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, baseDummyData, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function getInitials(name) {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}
