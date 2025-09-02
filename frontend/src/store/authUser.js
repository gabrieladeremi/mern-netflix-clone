import axios from "axios";
import { create } from "zustand";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    user: null,
    isSigninUp: false,
    isCheckingAuth: true,
    isLoggingOut: false,
    isLoggingIn: false,

    signup: async (credentials) => {
        set({ isSigninUp: true });
        try {
            const response = await axios.post("/api/v1/auth/signup", credentials);

            set({ user: response.data.user, isSigninUp: false });

            if (response.data.success) {
                toast.success("User signed up successfully");
            }

        } catch (error) {
            set({ isSigninUp: false, user: null });
            console.error("Error signing up:", error);
            toast.error(error?.response?.data?.message || "Error signing up");
        }
    },

    login: async (credentials) => {
        set({ isLoggingIn: true });
        try {
            const response = await axios.post("/api/v1/auth/login", credentials);
            set({ user: response.data.user, isLoggingIn: false });
            if (response.data.success) {
                toast.success("User logged in successfully");
            }
        } catch (error) {
            set({ isLoggingIn: false, user: null });
            console.error("Error logging in:", error);
            toast.error(error?.response?.data?.message || "Error logging in");
        }
     },

    logout: async () => { 
        set({ isLoggingOut: true });

        try {
            await axios.post("./api/v1/auth/logout");
            set({ user: null, isLoggingOut: false });
            toast.success("Logged out successfully");
        } catch (error) {
            set({ isLoggingOut: false });
            console.error("Error logging out:", error);
            toast.error(error?.response?.data?.message || "Error logging out");
        }
    },

    authCheck: async () => {
        set({ isCheckingAuth: true });

        try {
            const response = await axios.get("/api/v1/auth/");
            set({ user: response.data.user, isCheckingAuth: false });
            console.log('user', response.data.user)
        } catch (error) {
            set({ isCheckingAuth: false, user: null });
            console.error("Error checking auth:", error);
        }
    },


}));