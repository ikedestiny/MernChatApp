import { useEffect, useState } from "react";
import { useStore } from "../state/chatStore";
import { Stack, Container } from "react-bootstrap";
import UserChat from "../components/chat/UserCard";
import PotentialChatsRow from "../components/chat/PotentialChats";
import ChatBox from "../components/chat/ChatBox";
import { io } from 'socket.io-client'
import { userStore } from "../state/userStore";

const Chat = () => {
    const { error, userChats, setUserChats, allUsers, getAllUsers, socket, setSocket, onlineUsers, setOnlineUsers, notifications } = useStore();
    const { userId } = userStore()
    const [pChats, setPChats] = useState([]);


    useEffect(() => {
        const newSocket = io("http://localhost:3000");
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
            setSocket(null); // Cleanup from Zustand to avoid stale sockets
        };
    }, [userId]); // Runs whenever userId changes

    useEffect(() => {
        if (userId) setUserChats(userId); // Fetch user chats
        getAllUsers(); // Fetch all users
    }, [userId, notifications]);

    useEffect(() => {

        if (!socket || !userId) return;

        socket.emit("addNewUser", userId);

        const handleOnlineUsers = (res) => {
            setOnlineUsers(res);
        };

        socket.on("getOnlineUsers", handleOnlineUsers);

        return () => {
            socket.off("getOnlineUsers", handleOnlineUsers); // Cleanup listener on unmount
        };
    }, [socket, userId]); // Re-run effect when `socket` or `userId` changes



    useEffect(() => {
        if (allUsers?.length > 0 && userChats) {
            const potentialChats = allUsers.filter((u) => {
                if (u._id === userId) return false; // Exclude self
                return !userChats.some(chat => chat?.members.includes(u._id)); // Check if chat already exists
            });

            setPChats(potentialChats); // Update state only when needed
        }
    }, [allUsers, userChats, userId]); // Runs only when dependencies change

    return (
        <Container>
            <PotentialChatsRow chats={pChats} />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <Stack direction="horizontal" gap={4} className="align-items-start">
                <Stack className="messages-box pe-3 flex-grow-0" style={{ minHeight: "200px" }}>
                    <p>Messages</p>
                    {Array.isArray(userChats) && userChats.length > 0 ? (
                        userChats.map((chat, index) => (
                            <div key={index}>
                                <UserChat chat={chat} userId={userId} />
                            </div>
                        ))
                    ) : (
                        <p>No messages available.</p>
                    )}
                </Stack>
                <ChatBox></ChatBox>
            </Stack>
        </Container>
    );
};

export default Chat;
