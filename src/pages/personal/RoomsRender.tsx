import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Modal,
  useDisclosure,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  Button,
} from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { clearRoomNotifications } from "@/state/connectionSlice";
import { useNavigate } from "react-router-dom";
import { BsPlusCircle } from "react-icons/bs";
import { fetchToken } from "@/utils/login";
import axios from "axios";
import { fetchRooms } from "@/utils/roomService";
import { setRooms } from "@/state/userSlice";
import routes from "@/utils/routes";

// Fetch token as needed (ensure this function call is valid in your environment)
const token = await fetchToken();

// Handle room navigation (moved inside component to use hooks properly)
const handleRoomNavigation = (roomId: string, navigate: any, dispatch: any) => {
  dispatch(clearRoomNotifications(roomId));
  navigate(`/room/${roomId}`);
};

// Update rooms in Redux (moved inside component to use hooks properly)
const roomUpdater = async (dispatch: any) => {
  const rooms = await fetchRooms();
  dispatch(setRooms(rooms));
};

// Create a new room and update the state immediately
const createRoomRequest = async (newRoomName: string, dispatch: any) => {
  try {
    const response = await axios.post(
      `${routes.createRoom}?room_name=${newRoomName}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Assuming the API returns the newly created room
    const newRoom = response.data;

    // Update the rooms in the state immediately after creating the room
    dispatch((prevState: RootState) => ({
      ...prevState,
      userState: {
        ...prevState.userState,
        roomsJoined: [...prevState.userState.roomsJoined, newRoom],
      },
    }));

    console.log(newRoom);
  } catch (e) {
    console.log(e);
  }
};

// CreationBox Component
const CreationBox: React.FC<{ onRoomCreated: (roomName: string) => void }> = ({
  onRoomCreated,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [roomName, setRoomName] = useState("");

  return (
    <>
      <Card
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
      >
        <CardBody>
          <div
            className="flex flex-col justify-center items-center pb-5"
            onClick={onOpen}
          >
            <div className="pb-5 text-large">Create a New Room</div>
            <div>
              <BsPlusCircle size={50} />
            </div>
          </div>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(_onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Modal Title
                  </ModalHeader>
                  <ModalBody>
                    <div></div>
                    <div className="pb-1">
                      <h1>Customize your room</h1>
                      <Input
                        id="room-name"
                        label="Enter Room Name"
                        onChange={(e) => {
                          setRoomName(e.target.value);
                        }}
                      />
                      <Button
                        onClick={async () => {
                          await createRoomRequest(roomName, onRoomCreated);
                          onRoomCreated(roomName); // Callback to parent component
                          onOpenChange(); // Close the modal after creation
                        }}
                      >
                        Create
                      </Button>
                    </div>
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
        </CardBody>
      </Card>
    </>
  );
};

// RoomsRender Component
const RoomsRender: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const roomsJoined = useSelector(
    (state: RootState) => state.userState.roomsJoined
  );

  const handleRoomCreated = async (roomName: string) => {
    await roomUpdater(dispatch);
  };

  return (
    <>
      {roomsJoined.length === 0 ? (
        <>
          <CreationBox onRoomCreated={handleRoomCreated} />
        </>
      ) : (
        <>
          {roomsJoined.map((room) => (
            <Card
              key={room.id}
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
            >
              <CardHeader className="font-semibold justify-center">
                {room.room_name}
              </CardHeader>
              <CardBody
                onClick={() => {
                  handleRoomNavigation(room.id.toString(), navigate, dispatch);
                }}
              >
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac
                  purus in massa egestas mollis varius; dignissim elementum.
                </p>
              </CardBody>
            </Card>
          ))}
          <CreationBox onRoomCreated={handleRoomCreated} />
          {/* Render CreationBox at the end */}
        </>
      )}
    </>
  );
};

export default RoomsRender;
