import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import { userStore } from "../../state/userStore";
import { useStore } from "../../state/chatStore";
import { Stack } from 'react-bootstrap'
import moment from 'moment'
import { useEffect, useRef, useState } from "react";
import InputEmoji from 'react-input-emoji'
const ChatBox = () => {
    const {
        currentChat,
        currentChatMessages,
        setCurrentChatMessages,
        sendMessage,
        socket,
        justSent,
        realtimeMessage,
        notifications,
        setNotifications,
        markNotificationAsRead } = useStore()
    const { userId } = userStore()
    const { recipientUser } = useFetchRecipient(currentChat, userId)
    const [textMessage, setTextMessage] = useState("")



    const scroll = useRef()





    useEffect(() => { setCurrentChatMessages() }, [])

    useEffect(() => { scroll.current?.scrollIntoView({ behaviour: "smooth" }) }, [currentChatMessages])




    //send message realtime
    useEffect(() => {
        if (!socket || !userId) return;
        const recipientId = currentChat?.members?.find(id => id !== userId);
        socket.emit("sendMessage", { ...justSent, recipientId })

    }, [justSent]); // Re-run effect when `socket` or `userId` changes


    //receive message and notification
    useEffect(() => {
        if (!socket || !userId) return;

        const handleNewMessage = (res) => {
            if (currentChat?._id !== res.chatId) return;
            realtimeMessage(res); // Add received message to the chat
        };

        const handleNotification = (res) => {
            const chatIsOpen = currentChat?.members?.some(id => id == res.senderId)

            setNotifications({ ...res, isRead: chatIsOpen ? true : false }); // Append correctly

        };


        socket.on("getMessage", handleNewMessage);
        socket.on("getNotification", handleNotification);

        return () => {
            socket.off("getMessage", handleNewMessage);
            socket.off("getNotification", handleNotification);
        };
    }, [socket, currentChat, userId]); // Depend on `socket`, `currentChat`, and `userId`

    // Log notifications only after the state updates
    useEffect(() => {
        console.log("Updated notifications:", notifications);
    }, [notifications]);


    //return (<>{recipientUser.name}</>);

    if (!recipientUser) {
        return (<p style={{ textAlign: "center", width: "100" }}>No conversation selected yet</p>)
    }

    return (
        <Stack gap={4} className="chat-box">
            <div className="chat-header">
                <strong>{recipientUser?.name}</strong>
            </div>
            <Stack gap={3} className="messages">
                {
                    currentChatMessages?.map((message, index) => (
                        <Stack ref={scroll} key={index} className={`${message.senderId === userId ? "message self align-self-end flex-grow-0" : "message align-self-start flex-grow-0"}`}>
                            <span>{message?.text}</span>
                            <span className="message-footer">{moment(message?.createdAt).calendar()}</span>
                        </Stack>
                    ))
                }
            </Stack>
            <Stack direction="horizontal" gap={3} className="chat-input flex-grow-0">
                <InputEmoji value={textMessage} onChange={setTextMessage} fontFamily="nunito" borderColor="rgba(72,112,223,0.2)" />
                <button className="send-btn" onClick={() => { sendMessage(textMessage); setTextMessage("") }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                    </svg>
                </button>
            </Stack>
        </Stack>
    )
}

export default ChatBox;