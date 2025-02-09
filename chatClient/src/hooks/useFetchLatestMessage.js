import { useEffect, useState } from "react"
import { useStore } from "../state/chatStore"
import * as API from '../apicalls'

export const useFetchLatestMessage = (chat) => {
    const { realtimeMessage, notifications } = useStore()
    const [latestMessage, setLatestMessage] = useState(null)

    useEffect(() => {
        const getMessages = async () => {
            const response = await API.getMessages(chat?._id)

            if (response?.error) {
                return console.log("Error getting messages", response?.error);

            }

            const lastMessage = response[response?.length - 1]
            setLatestMessage(lastMessage)
        }
        getMessages();
    }, [realtimeMessage, notifications])
    return { latestMessage }
}