import Todo from "../models/Todo.js";
import { customError } from "../lib/customError.js";
import User from "../models/User.js";
import { generateFileUrl } from "../lib/urlGenerator.js";

export const addTodo = async (req, res, next) => {
  try {
    const { todoName, description, status } = req.validatedData;
    const userId = req.user.id;

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
    const status = req.query.status;

    let filter = { userId };

    if (status && status !== "all") {
      filter.status = status;
    }
    const startIndex = (page - 1) * limit;

    const todos = await Todo.find(filter).skip(startIndex).limit(limit);

    const total = await Todo.countDocuments(filter);

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

export const shareTodo = async (req, res, next) => {
  try {
    const { permission = "edit", emails } = req.body;
    const senderId = req.user._id;
    const { todoId } = req.params;



    if (!emails) {
      throw new customError("Email is required", 400);
    }

    const todo = await Todo.findById(todoId);

    // check the user who created the id is same the user who send it
    if (todo.userId.toString() !== senderId.toString()) {
      throw new customError("Can't send to Your-self", 404);
    }

    const receivers = await User.find({ email: { $in: emails } });

    if (receivers.length === 0) {
      throw new customError("No User found", 404);
    }

    let addedCount = 0;

    for (const reciver of receivers) {
      //skip for sending to yourself
      if (reciver._id.toString() === senderId.toString()) continue;

      //skip if already share

      const alreadyShared = todo.sharedWith.some(
        (share) => share.userId.toString() === reciver._id.toString(),
      );

      if (alreadyShared) continue;

      todo.sharedWith.push({
        userId: reciver._id,
        email: reciver.email,
        permission,
      });

      addedCount++;
    }

    if (addedCount > 0) {
      todo.isShared = true;

      await todo.save();
    }

    res.status(200).json({
      success: true,
      message: `Todo shared with ${addedCount} user(s)`,
      data: {
        todoId: todo._id,
        sharedCount: addedCount,
        skippedCount: receivers.length - addedCount,
        details: `${addedCount} new, ${receivers.length - addedCount} already shared`,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getSharedTodos = async (req, res, next) => {
  try {
    const userId = req.user._id;

    let sharedTodos = await Todo.find({ "sharedWith.userId": userId })
      .populate("userId", "fullName email profilePic");

    const filterSharedTodos = sharedTodos.map((todo) => {
      const todoObj = todo.toObject();
      
      return {
        ...todoObj,
        userId:{
          ...todoObj.userId,
          profilePic:generateFileUrl(todoObj.userId.profilePic,req)
        },
        sharedWith: todoObj.sharedWith.filter(
          (share) => share.userId.toString() === userId.toString()
        )
      };
    });

    res.status(200).json({
      success: true,
      data: filterSharedTodos,
    });
  } catch (error) {
    next(error);
  }
};