import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    todoName: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    status: {
      type: String,
      enum: ["pending", "completed", "canceled"],
      default: "pending",
      required: true,
    },
  },
  { timestamps: true }
);

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;
