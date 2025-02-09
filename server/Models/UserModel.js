const moongoose = require("mongoose")
const userSchema = new moongoose.Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 30 },
    email: { type: String, required: true, minlength: 3, maxlength: 30, unique: true },
    password: { type: String, required: true, minlength: 3, maxlength: 1024 },
}, { timestamps: true })

const userModel = moongoose.model("User", userSchema)

module.exports = userModel