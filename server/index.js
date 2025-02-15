const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const userRoute = require("./Routes/userRoute")
const chatRoute = require("./Routes/chatRoute")
const messageRoute = require("./Routes/messageRoute")



const app = express()
require("dotenv").config()

app.use(express.json())
app.use(cors())
app.use("/api/users", userRoute)
app.use("/api/chats", chatRoute)
app.use("/api/message", messageRoute)


const PORT = process.env.PORT || 5000

app.listen(PORT, (req, res) => {
    console.log(`Server running on port... ${PORT}`);
})
mongoose.connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
).then(() => {
    console.log("Database connection established");

}).catch((err) => {
    console.error("Database connection failed", err.message);

})



//CRUD

app.get("/", (req, res) => {
    res.send("Welcome to our chat app")
})