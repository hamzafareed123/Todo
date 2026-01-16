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

sharedWith: [
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    email: {
      type: String,
    },
    permission: {
      type: String,
      enum: ["view", "edit"],
      default: "view",
    },
    sharedAt: {
      type: Date,
      default: Date.now,
    },
  },
],

editHistory: [
  {
    editedBy: {
      type: String,
      required: true,
    },
    editedAt: {
      type: Date,
      default: Date.now,
    },
    changes: {
      description: String,
      status: String,
    },
  },
],

    isShared: Boolean,
  },
  { timestamps: true }
);

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;
