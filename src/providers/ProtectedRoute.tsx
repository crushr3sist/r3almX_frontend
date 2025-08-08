import { Navigate } from "react-router-dom";
import { useAuth } from "@/utils/AuthContext";
import React from "react";
import { Spinner } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/state/store";
import {
  fetchUserDataThunk,
  fetchRoomsThunk,
  fetchFriendsThunk,
  fetchStatusThunk,
} from "@/state/userThunks";
import { NavbarProvider } from "./NavbarProvider";
import NavBar from "@/components/navbar";
export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();

  const auth = useAuth();
  if (auth?.authLoading) {
    return <Spinner size="lg" />;
  }
  if (!auth?.isAuthenticated) {
    console.log(auth?.isAuthenticated);
    return <Navigate to="/auth/login" replace />;
  } else {
    (async () => {
      await Promise.all([
        dispatch(fetchUserDataThunk()),
        dispatch(fetchRoomsThunk()),
        dispatch(fetchFriendsThunk()),
        dispatch(fetchStatusThunk()),
      ]);
    })();
  }

  return (
    <>
      <NavbarProvider>
        {children}
        <NavBar />
      </NavbarProvider>
    </>
  );
}
