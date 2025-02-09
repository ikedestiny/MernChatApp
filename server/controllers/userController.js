const userModel = require("../Models/UserModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const validator = require("validator")

const createToken = (_id) => {
    const key = process.env.JWT_SECRET_KEY
    return jwt.sign({ _id }, key, { expiresIn: "3d" })
}

const registerUser = async (req, res) => {
    const { name, email, password } = req.body



    try {
        let user = await userModel.findOne({ email })

        if (user) return res.status(400).json("User with this email already exists")
        if (!name || !email || !password) return res.status(400).json("All fields are required")
        if (!validator.isEmail(email)) return res.status(400).json("Not a valid email address")
        if (!validator.isStrongPassword(password)) return res.status(400).json("Password not Strong enough include at least 1 number, uppercase,lowercase character and spaecial character and length must exceeed 8")

        user = new userModel({ name, email, password })
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)
        await user.save()
        const token = createToken(user._id)
        res.status(201).json({ _id: user.id, email, name, token })
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }

}



const loginUser = async (req, res) => {
    const { email, password } = req.body
    try {
        let user = await userModel.findOne({ email })
        if (!user) return res.status(400).json("Invalid email or password")

        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) return res.status(400).json("invalid email or password")

        const token = createToken(user._id)
        res.status(200).json({ _id: user._id, name: user.name, email, token })
    } catch (err) {

    }
}


const findOneUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        let user = await userModel.findById(userId)
        res.status(200).json(user)

    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
}
const findAllUsers = async (req, res) => {
    const userId = req.params.userId;
    try {
        let user = await userModel.find()
        res.status(200).json(user)

    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
}

module.exports = { registerUser, loginUser, findOneUser, findAllUsers }