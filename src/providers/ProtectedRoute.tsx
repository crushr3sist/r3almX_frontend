import { Navigate } from "react-router-dom";
import { useAuth } from "@/utils/AuthContext";
import React, { useEffect, useRef } from "react";
import { Spinner } from "@nextui-org/react";
import { useUserState } from "./UserProvider";
import {
  fetchUserData,
  fetchRoomsData,
  fetchFriendsData,
  fetchStatusData,
} from "@/utils/dataFetchers";
import { NavbarProvider } from "./NavbarProvider";
import NavBar from "@/components/navbar";
export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const {
    setUsername,
    setEmail,
    setPic,
    setRooms,
    addPinnedFriends,
    setStatus,
  } = useUserState();
  const didInit = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (didInit.current) return;

    didInit.current = true;

    // Fetch all data and update context
    const fetchAllData = async () => {
      try {
        const [userData, roomsData, friendsData, statusData] =
          await Promise.all([
            fetchUserData(),
            fetchRoomsData(),
            fetchFriendsData(),
            fetchStatusData(),
          ]);

        // Update user data
        setUsername(userData.username);
        setEmail(userData.email);
        setPic(userData.pic);

        // Update rooms
        if (roomsData && roomsData.length > 0) {
          setRooms(roomsData);
        }

        // Update friends
        addPinnedFriends(friendsData);

        // Update status
        setStatus(statusData);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };

    fetchAllData();
  }, [
    isAuthenticated,
    setUsername,
    setEmail,
    setPic,
    setRooms,
    addPinnedFriends,
    setStatus,
  ]);

  if (isLoading) return <Spinner size="lg" />;

  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;

  return (
    <>
      <NavbarProvider>
        {children}
        <NavBar />
      </NavbarProvider>
    </>
  );
}
