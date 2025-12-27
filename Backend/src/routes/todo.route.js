import express from "express";
import protectedRoute from "../middleware/auth.middleware.js";
import {
  addTodo,
  deleteTodo,
  getAllTodo,
  updateTodo,
  getTodoById,
} from "../controllers/todo.controller.js";

const router = express.Router();

router.post("/addTodo", protectedRoute, addTodo);
router.delete("/deleteTodo/:id", protectedRoute, deleteTodo);
router.get("/getAllTodos", protectedRoute, getAllTodo);
router.put("/updateTodo/:id", protectedRoute, updateTodo);
router.get("/getTodo/:id", protectedRoute, getTodoById);

export default router;
