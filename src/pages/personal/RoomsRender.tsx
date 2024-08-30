import React, { useState, useEffect } from "react";
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
  Spinner,
} from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { clearRoomNotifications } from "@/state/connectionSlice";
import { useNavigate } from "react-router-dom";
import { BsPlusCircle } from "react-icons/bs";
import axios from "axios";
import { setRooms } from "@/state/userSlice";
import routes from "@/utils/routes";
import { fetchRoomsThunk } from "@/state/userThunks";
import { fetchToken } from "@/utils/login";

const handleRoomNavigation = (roomId: string, navigate: any, dispatch: any) => {
  dispatch(clearRoomNotifications(roomId));
  navigate(`/room/${roomId}`);
};

const createRoomRequest = async (newRoomName: string, dispatch: any) => {
  try {
  const token = await fetchToken();

    const response = await axios.post(
      `${routes.createRoom}?room_name=${newRoomName}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const newRoom = response.data;

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
          rounded-sm 
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
                          onRoomCreated(roomName);
                          onOpenChange();
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

const RoomsRender: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);

  const roomsJoined = useSelector(
    (state: RootState) => state.userState.roomsJoined
  );

  useEffect(() => {
    const fetchAndSetRooms = async () => {
      await dispatch(fetchRoomsThunk());

      setLoading(false); // Set loading to false after rooms are fetched and set in state
    };

    fetchAndSetRooms();
  }, [dispatch]);

  const handleRoomCreated = async () => {
    setLoading(true); // Set loading to true when a new room is created
    await dispatch(fetchRoomsThunk());
    setLoading(false); // Set loading to false after rooms are updated
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-row relative">
      {roomsJoined.length === 0 ? (
        <>
          <CreationBox onRoomCreated={handleRoomCreated} />
        </>
      ) : (
        <>
          {roomsJoined.map((room) => {
            return (
              <Card
                key={room.id}
                className={`
                  border 
                  border-sepia 
                  rounded-sm 
                  shadow-lg 
                  m-1 
                  bg-black/50 
                  hover:bg-black/70 
                  text-sepia 
                  hover:shadow-lg  
                  cursor-pointer
                  h-60
                  w-60
                `}
              >
                <CardHeader className="font-semibold justify-center">
                  {room.room_name}
                </CardHeader>
                <CardBody
                  onClick={() => {
                    handleRoomNavigation(
                      room.id.toString(),
                      navigate,
                      dispatch
                    );
                  }}
                >
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac
                    purus in massa egestas mollis varius; dignissim elementum.
                  </p>
                </CardBody>
              </Card>
            );
          })}
          <CreationBox onRoomCreated={handleRoomCreated} />
        </>
      )}
    </div>
  );
};

export default RoomsRender;
