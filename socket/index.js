const { Server } = require("socket.io");

const io = new Server({ cors: { origin: "http://localhost:5173" } });
let onlineUsers = [];

io.on("connection", (socket) => {
    console.log("New connection: ", socket.id);

    // Listen to custom client connection
    socket.on('addNewUser', (userId) => {
        if (!onlineUsers.some(user => user.userId === userId)) {
            onlineUsers.push({ userId, socketId: socket.id });
        }

        io.emit("getOnlineUsers", onlineUsers);  // Send updated list
        console.log("Online users:", onlineUsers);

    });


    //add message
    socket.on("sendMessage", (message) => {
        console.log("recieved message: ", message);


        const user = onlineUsers.find(user => user.userId === message.recipientId)
        if (user) {
            io.to(user.socketId).emit("getMessage", message)
            io.to(user.socketId).emit("getNotification", {
                senderId: message?.senderId,
                isRead: false,
                date: new Date()
            })
        }
    })

    socket.on("disconnect", () => {
        onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
        io.emit("getOnlineUsers", onlineUsers);  // Send updated list after disconnect
    });
});

io.listen(3000);
