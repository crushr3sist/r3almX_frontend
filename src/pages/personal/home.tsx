import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Link,
  Image,
} from "@nextui-org/react";
import { LoremIpsum, Avatar } from "react-lorem-ipsum";

import { useNavbarContext } from "@/providers/NavbarContext";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { clearRoomNotifications } from "@/state/connectionSlice";
import { useNavigate } from "react-router-dom";
const handleRoomNavigation = (roomId: string) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  dispatch(clearRoomNotifications(roomId));
  navigate(`/room/${roomId}`);
};
const RoomsRender: React.FC = () => {
  const roomsJoined = useSelector(
    (state: RootState) => state.userState.roomsJoined
  );

  return (
    <>
      {roomsJoined.map((room) => {
        return (
          <Card
            key={room.id as string} // Add type assertion here
            className={`
              border 
              border-sepia 
              rounded-lg 
              shadow-lg 
              m-1 
              bg-black/50 
              hover:bg-black/70 
              text-sepia 
              hover:shadow-lg  
              cursor-pointer
              h-full
              w-60
              `}
            onClick={() => handleRoomNavigation(room.id.toString())}
          >
            <CardHeader className="font-semibold justify-center">
              {room.room_name}
            </CardHeader>
            <CardBody>
              <p>
                Lorem ipsum odor amet, consectetuer adipiscing elit. Ac purus in
                massa egestas mollis varius; dignissim elementum.
              </p>
            </CardBody>
          </Card>
        );
      })}
    </>
  );
};

const NewsRender: React.FC = () => {
  return (
    <>
      <h1>ff</h1>
    </>
  );
};

const FeedRender: React.FC = () => {
  return (
    <>
      <h1>ff</h1>
    </>
  );
};

const HomePage: React.FC = () => {
  const { isNavbarOpen } = useNavbarContext();

  return (
    <div
      className={`w-screen h-screen transition-padding duration-300 ${
        isNavbarOpen ? "pb-28" : "pb-20"
      } flex flex-col bg-black text-sepia relative`}
    >
      <div className="flex w-full h-full p-5">
        <Card className="h-full w-full rounded-lg shadow-lg bg-black/90 border border-sepia text-sepia backdrop-blur-md transition-width duration-300 ">
          <CardHeader>
            <p className="font-bold">R3almx</p> - Create your way
          </CardHeader>
          <Divider />
          <CardBody className="flex-1 flex flex-col overflow-hidden p-4 space-y-4">
            <div id="rooms" className="h-50">
              <h4>Your Rooms</h4>
              {/* Component that renders cards with user's room in horizontal carousel */}
              <div className=" flex flex-row justify-items-start overflow-x-auto p-2">
                <RoomsRender />
              </div>
            </div>
            <Divider />

            <div id="news">
              <h4>News:</h4>
              {/* Component that automatically loads news */}
              <div className=" flex flex-row justify-items-start overflow-x-auto p-2">
                <NewsRender />
              </div>
            </div>
            <Divider />

            <div id="feed">
              <h4>Your Friends feed: </h4>
              {/* Component that automatically loads the friends feed */}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
