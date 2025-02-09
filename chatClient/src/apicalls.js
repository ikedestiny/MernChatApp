import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:5000/api/",
    headers: {
        "Content-Type": "application/json"
    }
});

export const registerUser = async (user) => {
    try {
        const response = await api.post("users/register", user);
        return response.data;
    } catch (error) {
        console.error("Registration error:", error.response?.data || error.message);
        throw error;
    }
};

export const loginUser = async (user) => {
    try {
        const response = await api.post("users/login", user);
        return await response.data;
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }
};

export const getUserChats = async (userId) => {
    try {
        const response = await api.get("chats/" + userId)
        return response.data

    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }
}

export const getAllUsers = async () => {
    try {
        const response = await api.get("users/all")
        return response.data

    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }
}

export const createNewChat = async (firstId, secondId) => {
    try {
        const response = await api.post("chats", { firstId, secondId });
        return response.data;
    } catch (error) {
        console.error("Chat creation error:", error.response?.data || error.message);
        throw error; // Rethrow the error to be handled by the caller
    }
};

export const getMessages = async (chatId) => {
    try {
        const response = await api.get("message/" + chatId)
        return response.data
    } catch (error) {
        console.error("Chat creation error:", error.response?.data || error.message);
        throw error; // Rethrow the error to be handled by the caller
    }
}

export const sendMessage = async (senderId, chatId, text) => {
    try {
        const response = await api.post("message", { senderId, chatId, text })
        return response.data
    } catch (error) {
        console.error("Message Sending  error:", error.response?.data || error.message);
        throw error; // Rethrow the error to be handled by the caller
    }
}
