import React, { createContext, useContext, useState, useCallback } from "react";

interface INotificationContent {
  message: string;
  hint: string;
  roomId: string;
  channelId: string;
  messageId: string;
}

interface NotificationContextType {
  notifications: INotificationContent[];
  addNotification: (notification: INotificationContent) => void;
  clearNotifications: () => void;
  clearRoomNotifications: (roomId: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<INotificationContent[]>(
    []
  );

  const addNotification = useCallback((notification: INotificationContent) => {
    setNotifications((prev) => [...prev, notification]);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const clearRoomNotifications = useCallback((roomId: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.roomId !== roomId)
    );
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        clearNotifications,
        clearRoomNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
