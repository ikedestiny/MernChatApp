import { create } from "zustand";
import * as API from "../apicalls";

// Load stored user data from localStorage
const storedToken = localStorage.getItem("token") || "";
const storedUsername = localStorage.getItem("LoggedInUsername") || "";
const storedUserId = localStorage.getItem("userId") || "";

export const userStore = create((set, get) => ({
    name: "",
    email: "",
    password: "",
    LoggedInUsername: storedUsername, // Initialize from storage
    token: storedToken, // Initialize from storage
    userId: storedUserId,
    error: "",

    setName: (sname) => set({ name: sname }),
    setPassword: (pass) => set({ password: pass }),
    setEmail: (mail) => set({ email: mail }),

    login: async () => {
        const { password, email } = get();
        if (!email || !password) {
            set({ error: "All fields are required!" });
            return;
        }
        set({ error: "" });

        try {
            const res = await API.loginUser({ password, email });

            if (!res.token) {
                throw new Error("Invalid response from server");
            }

            // Save token & username in localStorage
            localStorage.setItem("token", res.token);
            localStorage.setItem("LoggedInUsername", res?.name || "");
            localStorage.setItem("userId", res?._id || "");


            set({
                token: res.token,
                userId: res._id,
                LoggedInUsername: res.name,
                password: "",
                email: "",
                name: ""
            });

        } catch (err) {
            console.error("Login error:", err);
            const errorMessage =
                typeof err.response?.data === "string"
                    ? err.response.data.replace(/"/g, "")
                    : err.response?.data?.message || "Login failed!";

            set({ error: errorMessage, name: "", password: "", email: "" });
        }
    },

    register: async () => {
        const { name, password, email } = get();
        if (!name || !email || !password) {
            set({ error: "All fields are required!" });
            return;
        }
        set({ error: "" });

        try {
            const res = await API.registerUser({ name, password, email });
            console.log("Registration successful:", res);

            set({ password: "", email: "", name: "" });
        } catch (err) {
            console.error("Registration error:", err);
            const errorMessage =
                typeof err.response?.data === "string"
                    ? err.response.data.replace(/"/g, "")
                    : err.response?.data?.message || "Registration failed!";

            set({ error: errorMessage, name: "", password: "", email: "" });
        }
    },

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("LoggedInUsername");
        localStorage.removeItem("userId");
        set({ token: "", LoggedInUsername: "" });
    },

    clearError: () => set({ error: "" })
}));
