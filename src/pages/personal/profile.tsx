import { Avatar, Button } from "@nextui-org/react";
import { RootState } from "@/state/store";
import { useSelector } from "react-redux";

function ProfilePage() {
  const pfp = useSelector((state: RootState) => state.userState.userState.pic);
  const username = useSelector(
    (state: RootState) => state.userState.userState.username
  );

  return (
    <div className="flex flex-col items-center p-8 bg-black text-white min-h-screen">
      <div className="flex flex-col md:flex-row items-center mb-8 w-full max-w-4xl border-b border-gray-800 pb-8">
        {/* Avatar */}
        <Avatar
          src={pfp}
          alt="User Avatar"
          className="w-36 h-36 mb-4 md:mb-0 md:mr-8 rounded-full border-2 border-gray-600"
        />
        {/* User Info */}
        <div className="flex flex-col items-center md:items-start">
          <h1 className="text-3xl font-bold">{username}</h1>
          <p className="text-lg text-gray-400 mt-2">
            Full Stack Developer. Passionate about building innovative solutions
            and exploring new technologies.
          </p>
          <p className="text-sm text-gray-500 mt-1">San Francisco, CA</p>
        </div>
      </div>

      {/* Profile Actions */}
      <div className="flex space-x-4 mb-8">
        <Button
          className="bg-green-500 text-black hover:bg-green-400 transition"
          onClick={() => {}}
        >
          Edit Profile
        </Button>
      </div>

      {/* Profile Content */}
      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-4">Recent Posts</h2>
        {/* Placeholder for posts */}
        <p className="text-gray-500 italic">No posts yet.</p>
      </div>
    </div>
  );
}

export default ProfilePage;
