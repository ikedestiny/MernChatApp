import { create } from "zustand";
import * as API from "../apicalls";

export const useStore = create((set, get) => ({
    error: "",
    userChats: null,
    allUsers: null,
    currentChat: null,
    currentChatMessages: [],
    justSent: "",
    socket: null,
    onlineUsers: [],
    notifications: [],
    latestMessage: "",
    setLatestMessage: (message) => { set({ latestMessage: message }) },
    setL: (currentUserId, mess) => {
        const updatedUsers = get().allUsers?.map(user => {
            if (user?._id === currentUserId) {
                return { ...user, latestMessage: mess }
            } else { return user }
        })

        set({ allUsers: updatedUsers })
    },
    getL: (id) => { return get().allUsers?.find(n => n._id === id)?.latestMessage },
    setNotifications: (not) => { set({ notifications: [...get().notifications, not] }) },
    markAllNotificationsAsRead: () => {
        const current = get().notifications.map(n => ({ ...n, isRead: true }))
        set({ notifications: current })

    },

    markNotificationAsRead: (notification, userId) => {
        const desiredChat = get().userChats.find(cha => {
            const chatMembers = [userId, notification.senderId]
            const isDesiredChat = cha?.members.every((member) => chatMembers.includes(member))
            return isDesiredChat
        })

        //mark the notification as read
        const updatedNotifications = get().notifications.map(n => {
            if (n.senderId === notification.senderId) {
                return { ...n, isRead: true }
            } else {
                return n;
            }
        })

        get().setCurrentChat(desiredChat)
        set({ notifications: updatedNotifications })
    },


    markThisUserNotificationsAsRead: (thisUsersNotificatons) => {
        const modNot = get().notifications.map(not => {
            let notification;
            thisUsersNotificatons?.forEach(n => {
                if (not.senderId === n.senderId) {
                    notification = { ...n, isRead: true }
                } else {
                    notification = not
                }
            })
            return notification;
        })
        set({ notifications: modNot })
    },


    setJustSent: (mess) => set({ justSent: mess }),

    setSocket: (socket) => set({ socket }),

    setOnlineUsers: (users) => set({ onlineUsers: users }),

    realtimeMessage: (message) => {
        set({ currentChatMessages: [...get().currentChatMessages, message] });
    },

    setUserChats: async () => {
        try {
            const userId = localStorage.getItem("userId") || "";
            if (!userId) throw new Error("User ID is missing!");

            const chats = await API.getUserChats(userId);
            set({ userChats: chats, error: "" });
        } catch (err) {
            console.error("Error fetching chats:", err);
            set({ error: "Failed to load chats!" });
        }
    },

    getAllUsers: async () => {
        try {
            const users = await API.getAllUsers();
            set({ allUsers: users, error: "" });
        } catch (err) {
            console.error("Error fetching users:", err);
            set({ error: "Failed to load all users!" });
        }
    },

    createChat: async (secondId) => {
        try {
            const userId = localStorage.getItem("userId");
            if (!userId || !secondId) throw new Error("User ID(s) missing!");

            await API.createNewChat(userId, secondId);
            await get().setUserChats();
        } catch (err) {
            console.error("Error creating chat:", err);
            set({ error: "Failed to create chat!" });
        }
    },

    setCurrentChat: (chat) => {
        set({ currentChat: chat, currentChatMessages: [] });
        get().setCurrentChatMessages()
    },

    setCurrentChatMessages: async () => {
        try {
            const chatId = get().currentChat?._id;
            if (!chatId) {
                set({ currentChatMessages: [] });
                return;
            }

            const messages = await API.getMessages(chatId);
            set({ currentChatMessages: messages });
        } catch (err) {
            console.error("Error fetching messages:", err);
            set({ error: "Failed to load messages!" });
        }
    },

    sendMessage: async (text) => {
        try {
            const userId = localStorage.getItem("userId") || "";
            const chatId = get().currentChat?._id;
            if (!userId || !chatId) throw new Error("Missing required data!");

            const messageSent = await API.sendMessage(userId, chatId, text);
            if (!messageSent) throw new Error("Failed to send message!");

            set((state) => ({
                justSent: messageSent,
                currentChatMessages: [...state.currentChatMessages, messageSent],
                error: "",
            }));
        } catch (err) {
            console.error("Error sending message:", err);
            set({ error: err.message || "An error occurred" });
        }
    },

    clearError: () => set({ error: "" }),
}));
