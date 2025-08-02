import { Navigate } from "react-router-dom";
import { useAuth } from "@/utils/AuthContext";
import React from "react";
import { Spinner } from "@nextui-org/react";

export default function GuestRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useAuth();
  if (auth?.authLoading) {
    return <Spinner size="lg" />;
  }
  if (auth?.isAuthenticated) {
    console.log(auth?.isAuthenticated);
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
