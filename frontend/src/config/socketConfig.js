import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SERVER_SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
});

export default socket;
