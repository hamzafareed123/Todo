import React from "react";
import avatar from "/avatar.png";
import { X, Lock, Edit2 } from "lucide-react";
import { useState } from "react";
import TodoForm from "../TodoForm/TodoForm";

const ViewDetailsModal = ({ todo, onClose }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  if (!todo) return null;

  const permission = todo.sharedWith[0]?.permission || "view";
  const sharedAt = todo.sharedWith[0]?.sharedAt;
  const creator = todo.userId;

  return (
    <>
      {!isEditModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={onClose}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-sm sm:max-w-md lg:max-w-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-black">Todo Details</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 cursor-pointer rounded-full text-gray-500 hover:text-gray-900 transition-all flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Todo Name
                </h3>
                <p className="text-xl font-semibold text-black">
                  {todo.todoName}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Description
                </h3>
                <p className="text-gray-700">{todo.description}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Shared By
                </h3>
                <div className="flex items-center gap-3">
                  <img
                    src={creator.profilePic || avatar}
                    alt={creator.fullName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-black">
                      {creator.fullName}
                    </p>
                    <p className="text-sm text-gray-500">{creator.email}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Status
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      todo.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : todo.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {todo.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Permission
                  </h3>
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium w-fit ${
                      permission === "edit"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {permission === "edit" ? (
                      <>
                        <Edit2 className="w-4 h-4" />
                        Can Edit
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        View Only
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Shared On</p>
                  <p className="font-semibold text-black">
                    {new Date(sharedAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Created On</p>
                  <p className="font-semibold text-black">
                    {new Date(todo.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 space-y-3">
              {permission === "edit" && (
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="w-full py-3 bg-black cursor-pointer text-white rounded-xl font-semibold hover:bg-gray-900 transition-colors"
                >
                  Edit Todo
                </button>
              )}
              <button
                onClick={onClose}
                className="w-full py-3 border cursor-pointer border-gray-200 text-black rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <TodoForm sharedTodo={todo} onClose={() => setIsEditModalOpen(false)} />
      )}
    </>
  );
};

export default ViewDetailsModal;
