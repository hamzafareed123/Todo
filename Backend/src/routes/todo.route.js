import express from "express";
import protectedRoute from "../middleware/auth.middleware.js";
import {
  addTodo,
  deleteTodo,
  getAllTodo,
  updateTodo,
  getTodoById,
  allTods,
  searchTodos,
  shareTodo,
  getSharedTodos,
  editSharedTodo,
} from "../controllers/todo.controller.js";
import { validate } from "../middleware/validationMiddleware.js";
import {
  createTodoSchema,
  updateTodoSchema,
} from "../validators/todoValidator.js";

const router = express.Router();

router.post("/addTodo", protectedRoute, validate(createTodoSchema), addTodo);
router.delete("/deleteTodo/:id", protectedRoute, deleteTodo);
router.get("/getAllTodos", protectedRoute, getAllTodo);
router.put(
  "/updateTodo/:id",
  protectedRoute,
  validate(updateTodoSchema),
  updateTodo,
);
router.get("/getTodo/:id", protectedRoute, getTodoById);
router.get("/allTodos", protectedRoute, allTods);
router.get("/searchTodos", protectedRoute, searchTodos);
router.post("/shareTodo/:todoId", protectedRoute, shareTodo);
router.get("/getSharedTodos", protectedRoute, getSharedTodos);
router.put("/editSharedTodo", protectedRoute, editSharedTodo);

export default router;
