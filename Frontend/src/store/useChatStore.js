import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUserLoading: false,
  isMessageLoading: false,
  messageListener: null,

  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  toggleSound: () => {
    const nextValue = !get().isSoundEnabled;
    localStorage.setItem("isSoundEnabled", JSON.stringify(nextValue));
    set({ isSoundEnabled: nextValue });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  getAllContacts: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/message/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/message/chat");
      set({ chats: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUserLoading: false });
    }
  },
  getMessagesByUserId: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessageLoading: false });
    }
  },
  sendMessage: async (msgData) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();

    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: msgData.text,
      image: msgData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };
    set({ messages: [...messages, optimisticMessage] });
    try {
      const res = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        msgData,
      );
      set({ messages: messages.concat(res.data) });
    } catch (error) {
      set({ messages: messages });
      toast.error(error.response.data.message || "Something went wrong...");
    }
  },
  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    const { selectedUser } = get();

    if (!socket || !selectedUser) return;

    const existingListener = get().messageListener;
    if (existingListener) {
      socket.off("newMessage", existingListener);
    }

    const messageListener = (newMessage) => {
      const {
        selectedUser: currentSelectedUser,
        isSoundEnabled,
        messages,
      } = get();

      if (!currentSelectedUser) return;
      if (newMessage.senderId !== currentSelectedUser._id) return;

      const alreadyExists = messages.some((msg) => msg._id === newMessage._id);
      if (!alreadyExists) {
        set({ messages: [...messages, newMessage] });
      }

      if (isSoundEnabled) {
        const notificationSound = new Audio("/sounds/notification.mp3");
        notificationSound.currentTime = 0;
        notificationSound
          .play()
          .catch((e) => console.log("Audio play failed:", e));
      }
    };

    socket.on("newMessage", messageListener);
    set({ messageListener });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    const { messageListener } = get();

    if (!socket || !messageListener) return;

    socket.off("newMessage", messageListener);
    set({ messageListener: null });
  },
}));
