import { axiosInstance } from "../lib/axios";
import { create } from "zustand";
import toast from "react-hot-toast";
export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: false,
  isSignUp: false,
  isLogin: false,

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      const response = await axiosInstance.get("/auth/check");
      set({ authUser: response.data });
    } catch (error) {
      console.log("Error in auth log is", error.response.data);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  Signup: async (data) => {
    try {
      set({ isSignUp: true });
      const response = await axiosInstance.post("/auth/signup", data);
      set({ authUser: response.data });
      toast.success(response.data.message);
    } catch (error) {
      console.log("Signup error details:", error.response?.data);
      toast.error(error.response.data.message || "SignUp Failed");
    } finally {
      set({ isSignUp: false });
    }
  },

  Login: async (data) => {
    try {
      set({ isLogin: true });
      const response = await axiosInstance.post("/auth/signin", data);
      set({ authUser: response.data });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message || "Login Failed");
    } finally {
      set({ isLogin: false });
    }
  },

  LogOut: async () => {
    try {
      const response = await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success(response.data.message);
    } catch (error) {
      console.log("Error in Logout", error);
      toast.error(error.response.data.message || "Logout Failed");
    }
  },

  updateProfile: async (data) => {
    try {
      const response = await axiosInstance.put("/auth/update-profile", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });
      set({ authUser: response.data });
      toast.success("Profile Updated Successfully");
    } catch (error) {
      console.log("Error in Updating Profile", error);
      toast.error(error.response.data.message || "Failed to update Profile");
    }
  },

  forgotPassword: async (data) => {
    try {
      const response = await axiosInstance.post("/auth/forgot-password", data);
      toast.success(response.data.message);
    } catch (error) {
      console.log("Error in Forgot password", error);
      toast.error(error.response.data.message || "Failed to send reset email");
    }
  },
}));
