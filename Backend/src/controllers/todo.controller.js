import Todo from "../models/Todo.js";

export const addTodo = async (req, res) => {
  try {
    const { todoName, description, status } = req.body;
    const userId = req.user.id;

    if (!todoName || todoName.trim() === "") {
      return res.status(400).json({ message: "todo name is required" });
    }

    const validateStatus = ["pending", "completed", "canceled"];

    if (!status && !validateStatus.includes(status)) {
      return res.status(400).json({
        message: "Status must be 'pending', 'completed', or 'canceled'",
      });
    }

    const newTodo = await Todo.create({
      userId: userId,
      todoName,
      description,
      status: status || "pending",
    });

    if (!newTodo) {
      return res.status(404).json({ message: "Error in Creating Todo" });
    }

    res
      .status(201)
      .json({ message: "Todo Created Successfully", todo: newTodo });
  } catch (error) {
    console.log("error in todo", error);
    return res.status(500).json({ message: "Error in Server" });
  }
};

export const getAllTodo = async (req, res) => {
  try {
    const userId = req.user.id;

    const allTodo = await Todo.find({ userId });

    return res.status(200).json(allTodo);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getTodoById = async (req,res)=>{
  try {
    const {id} = req.params;
    
    const todo= await Todo.findById(id);

    if(!todo){
      return res.status(404).json({message:"No todo found"});
    }

    res.status(200).json(todo);
  } catch (error) {
    return res.status(500).json({messag:"Server Error"});
  }
}

export const deleteTodo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const todo = await Todo.findById(id);
    if (todo.userId.toString() !== userId) {
      return res.status(403).json({ message: "Aunauthorize" });
    }

    const deleteTodo = await Todo.findByIdAndDelete(id);

    if (!deleteTodo) {
      return res.status(404).json({ messag: "Error in Deleteing Todo" });
    }

    res.status(200).json({ message: "Todo Deleted Successfully" });
  } catch (error) {
    console.log("Error in deleting todo", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (todo.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorize" });
    }

    const updatedTodo = await Todo.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res
      .status(200)
      .json({ message: "Updated Successfully", todo: updatedTodo });
  } catch (error) {
    console.log("error in updating todo", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
