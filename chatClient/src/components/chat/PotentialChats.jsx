import { useStore } from "../../state/chatStore";
import { userStore } from "../../state/userStore";
const PotentialChatsRow = ({ chats }) => {
    const { createChat, setOnlineUsers, onlineUsers } = useStore()



    return (
        <div className="all-users">
            {chats.length > 0 ? (
                chats.map((chat, index) => (
                    <div key={index} className="single-user" onClick={() => { createChat(chat._id) }}>
                        {chat.name || `Chat ${index + 1}`}
                        <span className={
                            onlineUsers?.some((user) => user?.userId === chat._id) ? "user-online" : ""
                        }></span>

                    </div>
                ))
            ) : (
                <p>No other chats available.</p>
            )}
        </div>
    );
};

export default PotentialChatsRow;
