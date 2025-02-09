import { useState } from "react";
import { useStore } from "../../state/chatStore";
import { userStore } from "../../state/userStore";
import moment from "moment";
const Notification = () => {
    const [isOpen, setIsOpen] = useState(false)
    const { notifications, markAllNotificationsAsRead, markNotificationAsRead, userChats, allUsers } = useStore()
    const { userId } = userStore()
    const unreadNotifications = notifications?.filter(n => !n.isRead)
    const readNotifications = notifications?.filter(n => n.isRead)
    const modifiedNotifications = notifications?.map((n) => {
        const sender = allUsers?.find(user => user._id === n.senderId)

        return {
            ...n, senderName: sender?.name
        }
    })






    return (
        <div className="notifications">
            <div className="notifications-icon">
                <svg onClick={() => { setIsOpen(!isOpen) }} xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-bell" viewBox="0 0 16 16">
                    <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6" />
                </svg>
                {unreadNotifications?.length > 0 && <span className="notification-count">
                    <span>{unreadNotifications?.length}</span>
                </span>}

            </div>
            <div className="notifications-box" style={{ display: isOpen ? "block" : "none" }}>
                <div className="notifications-header">
                    <h3>Notifications</h3>
                    <div className="mark-as-read" onClick={markAllNotificationsAsRead}>
                        Mark all as read</div>
                </div>
                {modifiedNotifications?.length === 0 ? <span className="notification">No notifications</span> : null}
                {modifiedNotifications && modifiedNotifications.map((notifications, index) => (
                    <div key={index} className={notifications.isRead ? "notification" : "notification not-read"} onClick={() => { markNotificationAsRead(notifications, userId); setIsOpen(false) }}>
                        <span>{`${notifications.senderName} sent you a message`}</span>
                        <span className="notification-time">{moment(notifications.date).calendar()}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Notification;