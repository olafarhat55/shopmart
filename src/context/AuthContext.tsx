"use client";

import LoginDialog from "@/components/auth/loginDialog";
import { ILogin, IProcessResponse, IRegister } from "@/interfaces";
import { apiService } from "@/service/apiService";
import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";

type AuthUser = {
  name?: string;
  id?: string;
};

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  setOpenLoginDialog: React.Dispatch<React.SetStateAction<boolean>>;
  login: (payload: ILogin) => Promise<IProcessResponse>;
  register: (payload: IRegister) => Promise<IProcessResponse>;
  logout: () => void;
  verify: () => Promise<boolean>;
  authProcess: (onAuthorized?: () => void) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [openLoginDialog, setOpenLoginDialog] = useState<boolean>(false);
  const [onAuthorizedCallback, setOnAuthorizedCallback] = useState<(() => void) | null | undefined>(null);
  const isAuthenticated = Boolean(user);

  const verify = async () => {
    console.log("start verify");
    setLoading(true);
    try {
      const token = apiService.getAuthToken();
      if (!token) {
        setUser(null);
        setLoading(false);
        console.log("verify failed");
        return false;
      }
      const response = await apiService.verify();
      if (response?.message != "verified") {
        setUser(null);
        apiService.setToken(null);
        setLoading(false);
        console.log("verify failed");
        return false;
      }
      
      console.log("verify success");
      setUser({ name: response?.decoded.name ?? null, id: response?.decoded.id ?? null });
      return true;
    } catch {
      setUser(null);
      setLoading(false);
    } finally {
      setLoading(false);
    }

    return false;
  };

  const login = async (data: ILogin) => {
    setLoading(true);
    try {
      const response = await apiService.login(data);
      if (response?.message == "success") {
        apiService.setToken(response.token);
        setUser(response.user);
        setLoading(false);
        verify();
        return { ok: true, message: "Login successful" };
      } else {
        setLoading(false);
        return {
          ok: false,
          message: response?.message || "Login failed. Please try again.",
        };
      }
    } catch {
      setLoading(false);
      return { ok: false, message: "An unexpected error occurred." };
    }
  };

  const register = async (data: IRegister) => {
    setLoading(true);
    try {
      const response = await apiService.register(data);
      if (response?.message == "success") {
        apiService.setToken(response.token);
        setUser(response.user);
        setLoading(false);
        return { ok: true, message: "Registration successful" };
      } else {
        setLoading(false);
        return {
          ok: false,
          message:
            response?.message || "Registration failed. Please try again.",
        };
      }
    } catch {
      setLoading(false);
      return { ok: false, message: "An unexpected error occurred." };
    }
  };

  const logout = () => {
    apiService.setToken(null);
    setUser(null);
  };

  const authProcess = async (onAuthorized?: () => void) => {
    if(isAuthenticated && onAuthorized != undefined) {
      onAuthorized();
    } else if(!isAuthenticated && onAuthorized != undefined) {
      // console.log("not authenticated");
      setOpenLoginDialog(true);
      setOnAuthorizedCallback(() => {
        return () => {
          onAuthorized();
          setOnAuthorizedCallback(null);
        }
      });
    }
  }

  useEffect(() => {
    verify();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        verify,
        setOpenLoginDialog,
        authProcess,
      }}
    >
      {children}

      <LoginDialog open={openLoginDialog} onLogin={onAuthorizedCallback} onOpenChange={setOpenLoginDialog}/>
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

export default AuthProvider;
