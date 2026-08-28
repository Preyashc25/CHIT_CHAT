import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningup: false,
  isLoggingin: false,
  isUpdatingProfile:false,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in AuthCheck", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data) => {
    set({ isSigningup: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created Successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningup: false });
    }
  },
  login: async (data) => {
    set({ isLoggingin: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });

      toast.success("Logged in Successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingin: false });
    }
  },
  logOut: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged Out Successfully!");
    } catch (error) {
      toast.error("Error Logging out");
      console.log("LogOut Error:", error);
    }
  },
  updateProfile: async (data) => {
    set({isUpdatingProfile:true})
    try{
      const res = await axiosInstance.put('/auth/update-profile',data)
      set({authUser:res.data})
      toast.success('Profile Updated Successfully')
      return res.data;
    }catch(error){
      console.log('Error while updating profile',error);
      toast.error(error.response?.data?.message || 'Unable to update profile');
      throw error;
    }finally{
      set({isUpdatingProfile:false})
    }
  },
}));
