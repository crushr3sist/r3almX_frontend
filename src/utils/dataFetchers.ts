import {
  userDataFetcher,
  fetchFriends,
  fetchRooms,
  statusFetcher,
  updateUserStatus,
} from "@/utils/backendCalls";

import { TSstatus } from "@/providers/UserProvider";

// These are now just regular async functions that return data
// Components will call these and then call context actions with the results

export const fetchUserData = async () => {
  const user = await userDataFetcher();
  return user;
};

export const fetchRoomsData = async () => {
  const response = await fetchRooms();
  // Extract the rooms array from the response object
  return response?.rooms || [];
};

export const fetchFriendsData = async () => {
  const pinnedFriends = await fetchFriends();
  return pinnedFriends.friends;
};

export const fetchStatusData = async (): Promise<TSstatus> => {
  const status = await statusFetcher();
  return status as TSstatus;
};

export const setUserStatus = async (status: TSstatus): Promise<void> => {
  await updateUserStatus(status);
};
