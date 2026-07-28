import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { getCookie } from "@utils/helper";
import { getAdminSocket, disconnectAdminSocket } from "@utils/socket";
import { notificationReceived } from "@Store/slices/adminNotificationSlice";
import { showNotification } from "@Store/slices/notificationSlice";
import { playNotificationSound } from "@utils/notificationSound";

// Mounts once inside the admin layout. Connects a socket authenticated as
// the logged-in admin and turns "new_user" / "new_order" server events into
// both a toast and a bell-dropdown entry. No-op for non-admin users.
export const AdminNotificationSocket = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const token = getCookie("token");
        if (!token) return;

        let isAdmin = false;
        try {
            isAdmin = jwtDecode(token)?.user_role === "admin";
        } catch {
            isAdmin = false;
        }
        if (!isAdmin) return;

        const socket = getAdminSocket(token);
        socket.connect();

        const handleNewUser = (payload) => {
            const name = payload?.first_name || payload?.user_name || "A new customer";
            dispatch(notificationReceived({
                type: "user",
                message: `New user registered: ${name}`,
                link: "/admin/customers",
            }));
            dispatch(showNotification({ type: "info", message: `New user registered: ${name}` }));
            playNotificationSound();
        };

        const handleNewOrder = (payload) => {
            const amount = typeof payload?.totalAmount === "number" ? payload.totalAmount.toFixed(2) : payload?.totalAmount;
            dispatch(notificationReceived({
                type: "order",
                message: `New order from ${payload?.customerName || "a customer"} — $${amount}`,
                link: "/admin/orders",
            }));
            dispatch(showNotification({ type: "success", message: `New order placed — $${amount}` }));
            playNotificationSound();
        };

        socket.on("new_user", handleNewUser);
        socket.on("new_order", handleNewOrder);

        return () => {
            socket.off("new_user", handleNewUser);
            socket.off("new_order", handleNewOrder);
            disconnectAdminSocket();
        };
    }, [dispatch]);

    return null;
};

export default AdminNotificationSocket;
