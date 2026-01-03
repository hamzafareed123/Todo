import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useTodoStore = create((set, get) => ({
  allTodos: [],
  isTodoLoading: true,
  selectedTab: "Tasks",
  isUploading: false,

  setTab: (tab) => {
    set({ selectedTab: tab });
  },

  getAllTodos: async () => {
    try {
      set({ isTodoLoading: true });
      const response = await axiosInstance.get("/todo/getAllTodos");
      set({ allTodos: response.data });
    } catch (error) {
      console.log("error in fetching todos", error);
      set({ allTodos: null });
    } finally {
      set({ isTodoLoading: false });
    }
  },

  addTodo: async (data) => {
    try {
      const response = await axiosInstance.post("/todo/addTodo", data);
      set({ allTodos: response.data });
      await get().getAllTodos();
      toast.success(response.data.message);
    } catch (error) {
      console.log("error in adding todos", error);
      toast.error(error.response.message || "Erro in adding Todo");
    }
  },

  deleteTodo: async (id) => {
    try {
      const response = await axiosInstance.delete(`/todo/deleteTodo/${id}`);
      await get().getAllTodos();
      toast.success(response.data.message);
    } catch (error) {
      console.log("Erro in deleting Todo", error);
      toast.error(error.response.message || "Failed to delte Todo");
    }
  },

  updateTodo: async (id, data) => {
    try {
      set({ isUploading: true });
      const response = await axiosInstance.put(`/todo/updateTodo/${id}`, data);
      toast.success(response.data.message);
      await get().getAllTodos();
    } catch (error) {
      console.log("Error in updating Todos ", error);
      toast.error(error.response.message);
    } finally {
      set({ isUploading: false });
    }
  },

  getPageTodos: async (page, limit) => {
    try {
      set({ isTodoLoading: true });
      const response = await axiosInstance.get(
        `/todo/allTodos?page=${page}&limit=${limit}`
      );
      set({ allTodos: response.data.todos });
    } catch {
      console.log("error in fetching paginated todos");
    } finally {
      set({ isTodoLoading: false });
    }
  },
}));
