"use client";
import { Provider } from "react-redux";
import React from "react";
import { store } from "@/redux/store";
import AuthProvider from "@/context/AuthContext";

export default function ProvidersContainer({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div>
      <AuthProvider>
        <Provider store={store}>{children}</Provider>
      </AuthProvider>
    </div>
  );
}
