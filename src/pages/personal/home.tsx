import React from "react";
import { Card, CardHeader, CardBody, Divider, Image } from "@nextui-org/react";
import logo from "../../assets/logo.gif";
import { useNavbarContext } from "@/providers/NavbarContext";
import RoomsRender from "./RoomsRender";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { SearchComponent } from "./search/component";

const NewsRender: React.FC = () => {
  return (
    <div className="animate-slideIn">
      <h1 className="text-lg font-bianzhidai">News:</h1>
      <p className="text-sepia">Latest updates will be displayed here.</p>
    </div>
  );
};

const FeedRender: React.FC = () => {
  return (
    <div className="animate-slideIn">
      <h1 className="text-lg font-bianzhidai">Your Friends Feed:</h1>
      <p className="text-sepia">Check out what your friends are up to.</p>
    </div>
  );
};

const HomePage: React.FC = () => {
  const { isNavbarOpen } = useNavbarContext();
  const username = useSelector(
    (state: RootState) => state.userState.userState.username
  );

  return (
    <div
      className={`w-screen h-screen transition-padding grain-bg duration-300 ${
        isNavbarOpen ? "pb-28" : "pb-5"
      } flex flex-col text-sepia relative`}
    >
      <div className="flex  w-full h-full p-5">
        <Card className="h-full w-full rounded-lg shadow-lg bg-black/90 border border-[#f4ecd8] text-sepia backdrop-blur-md transition-width duration-300">
          <CardHeader>
            <div className="w-full flex flex-row items-center justify-between">
              <div className="flex items-center">
                <Image
                  className="pr-2 md:shrink-0"
                  width={100}
                  src={logo}
                  isBlurred={true}
                  alt="R3almx Logo"
                />
                <p className="font-bianzhidai text-lg text-pretty text-sepia">
                  R3almx - Create your way
                </p>
              </div>
              <div className="flex flex-row items-center space-x-4 m-2">
                <SearchComponent />
              </div>
              <div className="flex flex-row items-center space-x-4">
                <p className="ml-2 mr-2">Welcome Back - {username}</p>
              </div>
            </div>
          </CardHeader>
          <Divider className="bg-sepia" />
          <CardBody className="p-2 text-sepia flex flex-col space-y-4">
            <RoomsRender />
            <Divider />
            <FeedRender />
            <Divider />
            <NewsRender />
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
