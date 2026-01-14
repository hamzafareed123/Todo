import Todo from "../models/Todo.js";
import { customError } from "../lib/customError.js";

export const addTodo = async (req, res, next) => {
  try {
    const { todoName, description, status } = req.body;
    const userId = req.user.id;

    if (!todoName || todoName.trim() === "") {
      throw new customError("todo name is required", 400);
    }

    const validateStatus = ["pending", "completed", "canceled"];

    if (!status && !validateStatus.includes(status)) {
      throw new customError(
        "Status must be 'pending', 'completed', or 'canceled'",
        400
      );
    }

    const newTodo = await Todo.create({
      userId: userId,
      todoName,
      description,
      status: status || "pending",
    });

    if (!newTodo) {
      throw new customError("Error in Creating Todo", 404);
    }

    res
      .status(201)
      .json({ message: "Todo Created Successfully", todo: newTodo });
  } catch (error) {
    next(error);
  }
};

export const getAllTodo = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const allTodo = await Todo.find({ userId });

    return res.status(200).json(allTodo);
  } catch (error) {
    next(error);
  }
};

export const getTodoById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findById(id);

    if (!todo) {
      throw new customError("No todo found", 404);
    }

    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
};

export const deleteTodo = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const todo = await Todo.findById(id);
    if (todo.userId.toString() !== userId) {
      throw new customError("Aunauthorize", 403);
    }

    const deleteTodo = await Todo.findByIdAndDelete(id);

    if (!deleteTodo) {
      throw new customError("Error in Deleteing Todo", 404);
    }

    res.status(200).json({ message: "Todo Deleted Successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateTodo = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const todo = await Todo.findById(id);

    if (!todo) {
      throw new customError("Todo not found", 404);
    }

    if (todo.userId.toString() !== userId) {
      throw new customError("Unauthorize", 403);
    }

    const updatedTodo = await Todo.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res
      .status(200)
      .json({ message: "Updated Successfully", todo: updatedTodo });
  } catch (error) {
    next(error);
  }
};

export const allTods = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const startIndex = (page - 1) * limit;

    const todos = await Todo.find({ userId }).skip(startIndex).limit(limit);

    const total = await Todo.countDocuments({ userId });
    res.status(200).json({ page, limit, total, todos });
  } catch (error) {
    next(error);
  }
};

export const searchTodos = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { query, page = 1, limit = 5 } = req.query;

    const skip = parseInt((page - 1) * limit);

    const totalTodos = await Todo.countDocuments({
      userId,
      $or: [
        { todoName: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });
    const todos = await Todo.find({
      userId,
      $or: [
        { todoName: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    })
      .skip(skip)
      .limit(parseInt(limit));

    // if (!todos || todos.length === 0) {
    //   return res.status(404).json({ message: "No todos found" });
    // }

    res.status(200).json({ todos: todos, total: totalTodos });
  } catch (error) {
    next(error);
  }
};
