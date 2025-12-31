import React, { useState } from "react";
import { useEffect } from "react";
import { useTodoStore } from "../../Store/todo-store";
import { Trash2Icon, Edit2Icon } from "lucide-react";
import EmptyTodoList from "../EmptyTodoList/EmptyTodoList";
import AddTasks from "../AddTasks/AddTasks";
import { X } from "lucide-react";
import Select from "react-select";

const TodoList = () => {
  const { allTodos, getAllTodos, deleteTodo, updateTodo } = useTodoStore();
  const [activeTodo, setActiveTodo] = useState("all");
  const [isModal, setIsModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    todoName: "",
    description: "",
    status: null,
  });

  console.log("todos are ", allTodos);

  const button = [
    { value: "all", name: "All" },
    { value: "pending", name: "IN PROGRESS" },
    { value: "completed", name: "COMPLETED" },
    { value: "canceled", name: "CANCELED" },
  ];

  useEffect(() => {
    getAllTodos();
  }, []);

  const filterTodos = () => {
    if (activeTodo === "all") {
      return allTodos;
    }
    const filterData = allTodos.filter((todo) => todo.status === activeTodo);
    return filterData;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateTodo(editingId, formData);
    setIsModal(false);
  };

  const options = [
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
    { value: "canceled", label: "Canceled" },
  ];

  return (
    <>
      <AddTasks />

      <div
        className=" w-full mt-10 text-black"
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
                className={`text-md text-gray-600 px-4 py-2 rounded-lg cursor-pointer hover:text-gray-500 transition ${
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
            {allTodos && allTodos.length > 0 ? (
              filterTodos().map((todo) => (
                <div
                  key={todo._id}
                  className=" flex flex-row items-center justify-between bg-white rounded-lg p-4 shadow-md  transition"
                >
                  <div className="flex flex-col items-start justify-start gap-1 flex-1">
                    <h5 className="text-lg font-semibold text-black">
                      {todo.todoName}
                    </h5>
                    <p className="text-sm text-gray-600">{todo.description}</p>
                  </div>
                  <div className="flex flex-row items-center justify-center gap-4 ml-4">
                    <button className="p-2  rounded-lg transition cursor-pointer text-black hover:text-gray-500">
                      <Edit2Icon
                        className="w-5 h-5"
                        onClick={() => {
                          setIsModal(true);
                          setEditingId(todo._id);
                          setFormData({
                            todoName: todo.todoName,
                            description: todo.description,
                            status: todo.status,
                          });
                        }}
                      />
                    </button>
                    <button className="p-2  rounded-lg transition cursor-pointer text-black hover:text-gray-500">
                      <Trash2Icon
                        className="w-5 h-5"
                        onClick={() => deleteTodo(todo._id)}
                      />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <EmptyTodoList />
            )}
          </div>
        </div>
      </div>

      {isModal && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsModal(false)}
        >
          <div
            className="form rounded-lg p-8 w-full max-w-sm sm:max-w-md md:max-w-2xl  mx-auto shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Update Task</h2>
              <button
                onClick={() => setIsModal(false)}
                className="cross-btn cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col">
                <label className=" font-medium mb-2">Todo</label>
                <input
                  type="text"
                  name="todo"
                  placeholder="Enter todo name here..."
                  value={formData.todoName}
                  onChange={(e) =>
                    setFormData({ ...formData, todoName: e.target.value })
                  }
                  className="px-4 py-2 rounded-lg border border-gray-300 outline-none text-gray-400"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className=" font-medium mb-2">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  placeholder="Enter todo detail"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="px-4 py-2 rounded-lg border border-gray-300 outline-none text-gray-400 resize-none"
                  rows="3"
                />
              </div>

              <div className="flex flex-col">
                <label className=" font-medium mb-2">Status</label>

                <Select
                  className="text-black cursor-pointer"
                  options={options}
                  value={
                    formData.status
                      ? options.find((opt) => opt.value === formData.status)
                      : null
                  }
                  onChange={(selectedOptions) =>
                    setFormData({ ...formData, status: selectedOptions.value })
                  }
                />
              </div>
              <div className="flex flex-col items-center justify-between sm:flex-row gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setIsModal(false)}
                  className=" font-semibold  cursor-pointer rounded-sm px-3 py-2"
                >
                  Cancel
                </button>
                <button type="submit" className="btn px-6 w-full sm:w-auto">
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
