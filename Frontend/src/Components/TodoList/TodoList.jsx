import React, { useState } from "react";
import { useEffect } from "react";
import { useTodoStore } from "../../Store/todo-store";
import { Trash2Icon, Edit2Icon, MoreVertical, Share2Icon,User } from "lucide-react";
import EmptyTodoList from "../EmptyTodoList/EmptyTodoList";
import AddTasks from "../AddTasks/AddTasks";
import { X } from "lucide-react";
import Select from "react-select";
import Pagination from "../Pagination/Pagination.jsx";
import ShareModal from "../ShareModal/ShareModal.jsx";


const TodoList = () => {
  const {
    allTodos,
    getPageTodos,
    deleteTodo,
    updateTodo,
    error,
    fieldErrors,
    clearErrors,
  } = useTodoStore();
  const [activeTodo, setActiveTodo] = useState("all");
  const [isModal, setIsModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedTodoForShare, setSelectedTodoForShare] = useState(null);

  const [formData, setFormData] = useState({
    todoName: "",
    description: "",
    status: null,
  });

  const button = [
    { value: "all", name: "All" },
    { value: "pending", name: "IN PROGRESS" },
    { value: "completed", name: "COMPLETED" },
    { value: "canceled", name: "CANCELED" },
  ];

  useEffect(() => {
    getPageTodos(1, 5, activeTodo);
  }, [activeTodo]);

 

  const shouldDisableButton =
    isSubmitted && Object.keys(fieldErrors || {}).length > 0;

  const handleCloseModal = () => {
    setIsModal(false);
    setIsSubmitted(false);
    clearErrors();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (fieldErrors?.[name]) {
      clearErrors();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    const result = await updateTodo(
      editingId,
      formData,
      currentPage,
      activeTodo,
    );

    if (result?.success) {
      handleCloseModal();
    }
  };

  const handleEdit = (todo) => {
    setIsModal(true);
    setEditingId(todo._id);
    setFormData({
      todoName: todo.todoName,
      description: todo.description,
      status: todo.status,
    });
    setOpenMenuId(null);
  };

  const handleDelete = (todoId) => {
    deleteTodo(todoId, currentPage, activeTodo);
    setOpenMenuId(null);
  };

  const handleShare = (todo) => {
   
    setShareModalOpen(true);
    setSelectedTodoForShare(todo);
    setOpenMenuId(null);
  };

  const options = [
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
    { value: "canceled", label: "Canceled" },
  ];

  const getEdit = (todo) => {
    if (todo.editHistory && todo.editHistory.length > 0) {
      return todo.editHistory[0].editedBy;
    }
    return null;
  };

  return (
    <>
      <AddTasks currentPage={currentPage} activeTodo={activeTodo} />

      <div
        className="w-full mt-10 text-black"
        style={{
          backgroundColor: "var(--body_background)",
          color: "var(--body_color)",
        }}
      >
        <div className="flex flex-col gap-6">
          <div className="flex gap-2 items-center justify-center">
            {button.map((btn) => (
              <button
                key={btn.name}
                onClick={() => setActiveTodo(btn.value)}
                className={`text-xs sm:text-sm lg:text-md text-gray-600 px-4 py-2 rounded-lg cursor-pointer hover:text-gray-500 transition ${
                  activeTodo === btn.value
                    ? "menu-item font-semibold"
                    : "text-gray-600"
                }`}
              >
                {btn.name}
              </button>
            ))}
          </div>

          <div className="w-full space-y-4 mx-auto max-w-2xl min-h-96">
            {error ? (
              <p className="text-center text-gray-500 mt-10">{error}</p>
            ) : allTodos && allTodos.length > 0 ? (
              <>
                {allTodos.map((todo) => {
                  const editTodo = getEdit(todo);
                  return (
                    <div
                      key={todo._id}
                      className="flex flex-row items-center justify-between bg-white rounded-lg p-4 shadow-md transition"
                    >
                      <div className="flex flex-col items-start justify-start gap-1 flex-1">
                       <div className="flex flex-row items-center justify-between w-full">
                         <h5 className="text-lg font-semibold text-black">
                          {todo.todoName}
                        </h5>
                        {editTodo && (
                          <div className="flex items-center gap-2 text-sm text-amber-600">
                            <User className="w-3 h-3" />
                            <span>Edited by: {editTodo}</span>
                          </div>
                        )}
                       </div>
                        <p className="text-sm text-gray-600 mt-2">
                          {todo.description}
                        </p>
                      </div>
                     

                      {/* three dots menu */}
                      <div className="relative ml-4">
                        <button
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId === todo._id ? null : todo._id,
                            )
                          }
                          className="p-2 rounded-lg transition cursor-pointer text-black hover:text-gray-500 hover:bg-gray-100"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>

                        {openMenuId === todo._id && (
                          <>
                            <div
                              className="fixed inset-0 z-40"
                              onClick={() => setOpenMenuId(null)}
                            />
                            <div
                              onClick={() => setOpenMenuId(null)}
                              className="absolute right-0 mt-2 w-48  bg-white border border-gray-300 rounded-lg shadow-lg z-50"
                            >
                              <button
                                onClick={() => handleEdit(todo)}
                                className="w-full flex items-center cursor-pointer gap-2 px-4 py-2 hover:bg-gray-100 transition text-left"
                              >
                                <Edit2Icon className="w-4 h-4" />
                                <span>Edit</span>
                              </button>

                              <button
                                onClick={() => handleShare(todo)}
                                className="w-full flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 transition text-left border-t border-gray-200"
                              >
                                <Share2Icon className="w-4 h-4" />
                                <span>Share</span>
                              </button>

                              <button
                                onClick={() => handleDelete(todo._id)}
                                className="w-full flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-red-100 transition text-left text-red-600 border-t border-gray-200"
                              >
                                <Trash2Icon className="w-4 h-4" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
                <Pagination activeTodo={activeTodo} />
              </>
            ) : (
              <EmptyTodoList />
            )}
          </div>
        </div>
      </div>

      {shareModalOpen && (
        <ShareModal
          todo={selectedTodoForShare}
          onClose={() => {
            setShareModalOpen(false);
            setSelectedTodoForShare(null);
          }}
        />
      )}

      {isModal && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="form rounded-lg p-8 w-full max-w-sm sm:max-w-md md:max-w-2xl mx-auto shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Update Task</h2>
              <button
                onClick={handleCloseModal}
                className="cross-btn cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col">
                <label className="font-medium mb-2">Todo</label>
                <input
                  type="text"
                  name="todoName"
                  placeholder="Enter todo name here..."
                  value={formData.todoName}
                  onChange={handleChange}
                  className={`px-4 py-2 rounded-lg border outline-none text-gray-400 ${
                    fieldErrors?.todoName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {fieldErrors?.todoName && (
                  <span className="text-red-500 text-sm">
                    {fieldErrors.todoName}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label className="font-medium mb-2">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  placeholder="Enter todo detail"
                  value={formData.description}
                  onChange={handleChange}
                  className={`px-4 py-2 rounded-lg border outline-none text-gray-400 resize-none ${
                    fieldErrors?.description
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  rows="3"
                />
                {fieldErrors?.description && (
                  <span className="text-red-500 text-sm">
                    {fieldErrors.description}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label className="font-medium mb-2">Status</label>
                <Select
                  className="text-black cursor-pointer"
                  options={options}
                  value={
                    formData.status
                      ? options.find((opt) => opt.value === formData.status)
                      : null
                  }
                  onChange={(selectedOptions) => {
                    setFormData({ ...formData, status: selectedOptions.value });
                    if (fieldErrors?.status) {
                      clearErrors();
                    }
                  }}
                />
              </div>

              <div className="flex flex-col items-center justify-between sm:flex-row gap-4 mt-8">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="font-semibold cursor-pointer rounded-sm px-3 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn px-6 w-full sm:w-auto"
                  disabled={shouldDisableButton}
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default TodoList;
