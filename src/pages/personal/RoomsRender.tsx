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
import { useUserState } from "@/providers/UserProvider";
import { useNotifications } from "@/providers/NotificationProvider";
import { fetchRoomsData } from "@/utils/dataFetchers";
import { useNavigate } from "react-router-dom";
import { BsPlusCircle } from "react-icons/bs";
import axios from "axios";
import routes from "@/utils/routes";
import { fetchToken } from "@/utils/login";

const handleRoomNavigation = (
  roomId: string,
  navigate: (path: string) => void,
  clearRoomNotifications: (roomId: string) => void
) => {
  clearRoomNotifications(roomId);
  navigate(`/room/${roomId}`);
};

const createRoomRequest = async (
  newRoomName: string,
  addRoom: (room: any) => void
) => {
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
    addRoom(newRoom);
  } catch (error) {
    console.error("Failed to create room:", error);
  }
};

const CreationBox: React.FC<{ onRoomCreated: (roomName: string) => void }> = ({
  onRoomCreated,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newRoomName, setNewRoomName] = useState("");
  const { addRoom } = useUserState();

  const handleCreate = async () => {
    if (newRoomName.trim()) {
      await createRoomRequest(newRoomName, addRoom);
      onRoomCreated(newRoomName);
      setNewRoomName("");
      onClose();
    }
  };

  return (
    <>
      <Card
        onClick={onOpen}
        className="border border-[#f4ecd8] rounded-sm shadow-lg m-1 bg-black/50 hover:bg-black/70 text-sepia hover:shadow-lg cursor-pointer h-60 w-60"
      >
        <CardBody className="flex items-center justify-center">
          <BsPlusCircle size={64} className="text-sepia/70" />
          <p className="mt-4 text-center text-sepia/70">Create New Room</p>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} placement="center">
        <ModalContent>
          <ModalHeader>Create New Room</ModalHeader>
          <ModalBody>
            <Input
              placeholder="Enter room name"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleCreate()}
            />
            <div className="flex justify-end gap-2 pb-4">
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleCreate}>
                Create
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const RoomsRender: React.FC = () => {
  const navigate = useNavigate();
  const { roomsJoined, setRooms } = useUserState();
  const { clearRoomNotifications } = useNotifications();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndSetRooms = async () => {
      try {
        const rooms = await fetchRoomsData();
        if (rooms && Array.isArray(rooms) && rooms.length > 0) {
          setRooms(rooms);
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
        setLoading(false);
      }
    };

    fetchAndSetRooms();
  }, [setRooms]);

  const handleRoomCreated = async () => {
    setLoading(true);
    try {
      const rooms = await fetchRoomsData();
      if (rooms && Array.isArray(rooms) && rooms.length > 0) {
        setRooms(rooms);
      }
    } catch (error) {
      console.error("Failed to refresh rooms:", error);
    }
    setLoading(false);
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
                className="border border-[#f4ecd8] rounded-sm shadow-lg m-1 bg-black/50 hover:bg-black/70 text-sepia hover:shadow-lg cursor-pointer h-60 w-60"
              >
                <CardHeader
                  onClick={() =>
                    handleRoomNavigation(
                      room.id,
                      navigate,
                      clearRoomNotifications
                    )
                  }
                  className="flex-col items-start px-4 pb-0 pt-2 h-full"
                >
                  <h4 className="font-bold text-large text-sepia">
                    {room.room_name}
                  </h4>
                  <small className="text-default-500">
                    Members: {room.members.length}
                  </small>
                  <small className="text-default-500">
                    Owner: {room.room_owner}
                  </small>
                  {room.notifications > 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                      {room.notifications}
                    </div>
                  )}
                </CardHeader>
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
