import { useState, useEffect } from "react";
import { api } from "../apicalls";

export const useFetchRecipient = (chat, userId) => {
    const [recipientUser, setRecipientUser] = useState(null);
    const recipientId = chat?.members?.find(id => id !== userId);

    useEffect(() => {
        const getUser = async () => {
            if (!recipientId) return; // Don't run if recipientId is missing

            try {
                const response = await api.get("users/find/" + recipientId);
                setRecipientUser(response.data);
            } catch (error) {
                console.error("Error fetching recipient user:", error);
            }
        };

        getUser(); // Call the function inside useEffect
    }, [recipientId]); // Dependency array ensures it runs when recipientId changes

    return { recipientUser };
};
