import React from "react";
import { Card, CardHeader, CardBody, Divider } from "@nextui-org/react";

import { useNavbarContext } from "@/providers/NavbarContext";
import RoomsRender from "./RoomsRender";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";

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

  const username = useSelector(
    (state: RootState) => state.userState.userState.username
  );

  return (
    <div
      className={`w-screen h-screen transition-padding duration-300 ${
        isNavbarOpen ? "pb-28" : "pb-20"
      } flex flex-col bg-black text-sepia relative`}
    >
      <div className="flex w-full h-full p-5">
        <Card className="h-full w-full rounded-lg shadow-lg bg-black/90 border border-sepia text-sepia backdrop-blur-md transition-width duration-300 ">
          <CardHeader className=" w-full flex flex-row  items-center ">
            <p className="w-full font-bold justify-items-start">
              R3almx - Create your way
            </p>
            <p className="w-full font-bold justify-items-end">
              Welcome Back - {username}
            </p>
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
