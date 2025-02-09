import { useFetchRecipient } from '../../hooks/useFetchRecipient'
import { Stack } from "react-bootstrap"
import avatar from '../../assets/avatar.svg'
import { useStore } from '../../state/chatStore';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { useFetchLatestMessage } from '../../hooks/useFetchLatestMessage';

const UserChat = ({ chat, userId }) => {
    const { recipientUser } = useFetchRecipient(chat, userId)
    const { latestMessage } = useFetchLatestMessage(chat)
    const { currentChat,
        setCurrentChat,
        currentChatMessages,
        setCurrentChatMessages,
        onlineUsers,
        notifications,
        markThisUserNotificationsAsRead,
        socket } = useStore()





    const unreadNotifications = notifications?.filter(n => !n.isRead)
    const currentUsersUnreadNotifications = unreadNotifications?.filter(n => n.senderId === recipientUser?._id)


    return (<Stack direction='horizontal' gap={3} className='user-card align-items-center p-2 justify-content-between' role='button' onClick={async () => { setCurrentChat(chat); setCurrentChatMessages(); if (currentUsersUnreadNotifications?.length > 0) { markThisUserNotificationsAsRead(currentUsersUnreadNotifications) } }}>
        <div className='d-flex'>
            <div className='me-2'>
                <img src={avatar} height="35px" />
            </div>
            <div className="text-content">
                <div className="name">{recipientUser?.name}</div>
                <div className="text">{latestMessage?.text.substring(0, 20)}</div>
            </div>
        </div>
        <div className="d-flex flex-column align-items end">
            <span className={
                onlineUsers?.some((user) => user?.userId === recipientUser?._id) ? "user-online" : ""
            }></span>
            {currentUsersUnreadNotifications.length > 0 && <>
                <div className="date">{moment(latestMessage?.createdAt).calendar()}</div>
                <div className="this-user-notifications">{currentUsersUnreadNotifications.length}</div>
            </>}

        </div>
    </Stack>)
};

export default UserChat;
