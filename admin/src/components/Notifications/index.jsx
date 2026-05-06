import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import './styles.scss'
import { showNotification } from "@Store/slices/notificationSlice";


const Notification = () => {
    const dispatch = useDispatch();
    const { message, delay, type } = useSelector(state => state.notification);

    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(function () {
            dispatch(showNotification({
                message: '',
                delay: 1000,
                type: ''
            }))
        }, delay || 1000);

        return () => clearTimeout(timer)
    }, [message, delay])

    if (!message) return null;
    return (
        <React.Fragment>
            <div className={`st-notification-wrapper st-notification--${type || 'info'}`}>
                {message}
            </div>
        </React.Fragment>
    )
}

export default Notification;