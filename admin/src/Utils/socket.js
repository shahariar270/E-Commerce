import { io } from "socket.io-client";
import { BASE } from "./helper";

let socket = null;

// Lazily creates a single shared socket connection authenticated with the
// current admin's JWT. The server rejects the handshake for anyone who
// isn't an active admin, so this is safe to call as soon as a token exists.
export const getAdminSocket = (token) => {
    if (socket) return socket;

    socket = io(BASE, {
        auth: { token },
        autoConnect: false,
    });

    return socket;
};

export const disconnectAdminSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
