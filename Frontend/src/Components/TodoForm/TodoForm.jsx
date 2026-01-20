import React, { useState } from "react";
import { X } from "lucide-react";
import { useTodoStore } from "../../Store/todo-store";

const TodoForm = ({ sharedTodo, onClose }) => {
  const [formData, setFormData] = useState({
    todoName: sharedTodo?.todoName || "",
    description: sharedTodo?.description || "",
    status: sharedTodo?.status || "pending",
  });
  const {updateSharedTodo} = useTodoStore()

  const [loading, setLoading] = useState(false);

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
    { value: "canceled", label: "Canceled" },
  ];

  console.log("Share Todo Values" ,sharedTodo)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      status: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      setLoading(true)
      console.log("Updating todo:", formData);
     updateSharedTodo(formData,sharedTodo._id)
      onClose();
    } catch (error) {
      console.log("Error updating todo:", error);
    
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-sm sm:max-w-md lg:max-w-xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
  
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-black">Edit Todo</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 cursor-pointer rounded-full text-gray-500 hover:text-gray-900 transition-all flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

 
        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          <div className="flex flex-col">
            <label className="font-semibold mb-2 text-black">Todo Name</label>
            <input
              type="text"
              readOnly
              name="todoName"
              placeholder="Enter todo name here..."
              value={formData.todoName}
              onChange={handleChange}
              className="px-4 py-2 rounded-lg border border-gray-300 outline-none focus:border-black focus:bg-white transition-all"
            />
          </div>

      
          <div className="flex flex-col">
            <label className="font-semibold mb-2 text-black">
              Description (Optional)
            </label>
            <textarea
              name="description"
              placeholder="Enter todo detail"
              value={formData.description}
              onChange={handleChange}
              className="px-4 py-2 rounded-lg border border-gray-300 outline-none focus:border-black focus:bg-white transition-all resize-none"
              rows="3"
            />
          </div>

       
          <div className="flex flex-col">
            <label className="font-semibold mb-2 text-black">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleStatusChange}
              className="px-4 py-2 rounded-lg border border-gray-300 outline-none focus:border-black focus:bg-white transition-all cursor-pointer"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-3 mt-8">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-900 disabled:bg-gray-400 transition-colors"
            >
              {loading ? "Updating..." : "Update Todo"}
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 border border-gray-200 text-black rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoForm;