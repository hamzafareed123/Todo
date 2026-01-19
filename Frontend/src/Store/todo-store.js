import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useTodoStore = create((set, get) => ({
  allTodos: [],
  isTodoLoading: true,
  selectedTab: "Tasks",
  isUploading: false,
  totalTodos: 0,
  inputValue: "",
  totalSearchCount: 0,
  fieldErrors: {},

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

  addTodo: async (data, currentPage = 1, activeTodo = "all") => {
    try {
      set({ fieldErrors: {} });

      const response = await axiosInstance.post("/todo/addTodo", data);

      const { inputValue } = get();

      if (inputValue && inputValue.trim()) {
        await get().searchTodos(inputValue, 1, 5);
      } else {
        await get().getPageTodos(currentPage, 5, activeTodo || "all");
      }

      set({ fieldErrors: {} });
      toast.success(response.data.message);
      return { success: true };
    } catch (error) {
      set({ fieldErrors: error.response?.data?.errors || {} });
      toast.error(error.response?.data?.message || "Error in adding Todo");
      return { success: false };
    }
  },

  deleteTodo: async (id, currentPage = 1, activeTodo = "all") => {
    try {
      const response = await axiosInstance.delete(`/todo/deleteTodo/${id}`);

      const { inputValue } = get();

      if (inputValue && inputValue.trim()) {
        await get().searchTodos(inputValue, currentPage, 5);
      } else {
        await get().getPageTodos(currentPage, 5, activeTodo || "all");
      }

      toast.success(response.data.message);
    } catch (error) {
      console.log("Error in deleting Todo", error);
      toast.error(error.response?.data?.message || "Failed to delete Todo");
    }
  },

  updateTodo: async (id, data, currentPage = 1, activeTodo = "all") => {
    try {
      set({ isUploading: true, fieldErrors: {} });

      const response = await axiosInstance.put(`/todo/updateTodo/${id}`, data);

      await get().getPageTodos(currentPage, 5, activeTodo || "all");

      set({ fieldErrors: {} });
      toast.success(response.data.message);
      return { success: true };
    } catch (error) {
      set({ fieldErrors: error.response?.data?.errors || {} });
      toast.error(error.response?.data?.message || "Error in updating Todo");
      return { success: false };
    } finally {
      set({ isUploading: false });
    }
  },

  getPageTodos: async (page, limit, status) => {
    try {
      set({ isTodoLoading: true });

      let url = `/todo/allTodos?page=${page}&limit=${limit}`;
      if (status && status !== "all") {
        url += `&status=${status}`;
      }
      const response = await axiosInstance.get(url);

      set({ allTodos: response.data.todos });
      set({ totalTodos: response.data.total });
    } catch (error) {
      console.log("error in fetching paginated todos", error);
    } finally {
      set({ isTodoLoading: false });
    }
  },

  setInputValue: (value) => {
    set({ inputValue: value });
    if (!value || value.trim() === "") {
      set({ error: null });
      get().getPageTodos(1, 5);
    } else {
      get().searchTodos(value, 1, 5);
    }
  },

  searchTodos: async (query, page, limit) => {
    try {
      set({ isTodoLoading: true });
      const response = await axiosInstance.get(
        `/todo/searchTodos?query=${query}&page=${page}&limit=${limit}`,
      );

      set({
        allTodos: response.data.todos,
        error: response.data.todos.length === 0 ? "No todos found" : null,
        totalSearchCount: response.data.total,
        isTodoLoading: false,
      });
    } catch (error) {
      console.log("Error in searching todos", error);
      set({ isTodoLoading: false });
    }
  },

  clearErrors: () => {
    set({ fieldErrors: {} });
  },

  shareTodo: async (sharedData, todoId) => {
    try {
      const response = await axiosInstance.post(
        `/todo/shareTodo/${todoId}`,
        sharedData,
      );
      console.log("response in share todo ", response);
      const { sharedCount, skippedCount } = response.data.data;
      if (sharedCount == 0) {
        toast.success("Todo already shared with selected users");
      } else if (sharedCount > 0 && skippedCount > 0) {
        toast.success(
          `Shared with ${sharedCount} user(s). ${skippedCount} already had access`,
        );
      } else {
        toast.success(response?.data.message || "Todo Shared Successfully");
      }
    } catch (error) {
      console.log("Error in sharing response ", error);
      toast.error(error.response?.data?.message || "Error in Sharing Todo");
    }
  },

  getSharedTodos : async()=>{
    try {
      const response = await axiosInstance.get("/todo/getSharedTodos");
      console.log(response)
      return response.data.data
    } catch (error) {
      console.log(error)
      toast.error("error in fetching todos")
    }
  }
}));
