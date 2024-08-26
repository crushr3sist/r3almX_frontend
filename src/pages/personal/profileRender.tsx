import { useEffect, useState } from "react";
import { Avatar, Button } from "@nextui-org/react";
import { useParams } from "react-router-dom";
import axios from "axios";
import routes from "@/utils/routes";
import { useLocation } from "react-router-dom";

// Function to fetch user info
const fetchUserInfo = async (
  username: string,
  userId: string
): Promise<any> => {
  const response = await axios.get(
    `${routes.fetchUser}?token=${routes.userToken}&username=${username}&userid=${userId}`
  );
  return response.data;
};

const sendFriendRequest = async (username: string, userId: string) => {
  const response = await axios.post(
    `${routes.friendRequest}?username=${username}&user_id=${userId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${routes.userToken}`,
      },
    }
  );
  return response.data;
};

const checkFriendStatus = async (userId: string) => {
  const response = await axios.get(`${routes.friendStatus}?user_id=${userId}`, {
    headers: {
      Authorization: `Bearer ${routes.userToken}`,
    },
  });
  return response.data;
};

function ProfilePageFactory() {
  const { username } = useParams();
  const location = useLocation();
  const { userId } = location.state || {};

  const [userInfo, setUserInfo] = useState<any>(null);
  const [friendStatus, setFriendStatus] = useState(null);

  // Fetch user info when the component mounts
  useEffect(() => {
    if (username) {
      fetchUserInfo(username, userId)
        .then((data) => setUserInfo(data))
        .catch((error) => console.error("Failed to fetch user info:", error));
    }
  }, [username]);

  useEffect(() => {
    if (friendStatus === null) {
      checkFriendStatus(userId)
        .then((data) => {
          setFriendStatus(data.friend_status);
          console.log(data.friend_status);
        })
        .catch((error) => console.error("Failed to check user info:", error));
    }
  }, [friendStatus]);

  const handleFriendRequest = async () => {
    try {
      const response = await sendFriendRequest(username, userId);
      if (response.data.status === 200) {
        setFriendStatus(true);
      }
    } catch (error) {
      console.error("Failed to send friend request:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-8 bg-black text-white min-h-screen">
      <div className="flex flex-col md:flex-row items-center mb-8 w-full max-w-4xl border-b border-gray-800 pb-8">
        {/* Avatar */}
        <Avatar
          src={userInfo?.user.pic} // Fallback to state if userInfo.pic is not available
          alt="User Avatar"
          className="w-36 h-36 mb-4 md:mb-0 md:mr-8"
        />
        {/* User Info */}
        <div className="flex flex-col items-center md:items-start">
          <h1 className="text-3xl font-bold">{username}</h1>
          <p className="text-lg text-gray-400 mt-2">
            {userInfo?.bio ||
              "Full Stack Developer. Passionate about building innovative solutions and exploring new technologies."}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {userInfo?.location || "San Francisco, CA"}
          </p>
          <div className="flex space-x-4 mb-8 mt-5">
            {friendStatus === true ? (
              <>
                <Button
                  variant="bordered"
                  className="border-green-500 text-white hover:bg-green-400 transition"
                  onClick={() => {}}
                >
                  unfriend
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="bordered"
                  className="border-green-500 text-white hover:bg-green-400 transition"
                  onClick={() => {
                    handleFriendRequest();
                  }}
                >
                  Follow
                </Button>
              </>
            )}
            <Button
              variant="bordered"
              className="border-gray-700 text-white hover:bg-gray-600 transition"
            >
              Message
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-4">Recent Posts</h2>
        <p className="text-gray-500 italic">No posts yet.</p>
      </div>
    </div>
  );
}

export default ProfilePageFactory;
