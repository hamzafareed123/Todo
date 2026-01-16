import { Moon, Sun, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useTodoStore } from "../../Store/todo-store";
import { useDebounce } from "../../hooks/useDebounce";

const AddTasks = ({ currentPage = 1, activeTodo = "all"}) => {
  const [isModal, setIsModal] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [search, setSearch] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    todoName: "",
    description: "",
    status: null,
  });

  const { addTodo, setInputValue, fieldErrors, clearErrors } = useTodoStore();

  const options = [
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
    { value: "canceled", label: "Canceled" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (fieldErrors?.[name]) {
      clearErrors();
    }
  };

  const searchDebounce = useDebounce((value) => {
    console.log("search value is:", value);
    setInputValue(value);
  }, 500);

  const shouldDisableButton =
    isSubmitted && Object.keys(fieldErrors || {}).length > 0;

  const handleCloseModal = () => {
    setIsModal(false);
    setFormData({
      todoName: "",
      description: "",
      status: null,
    });
    setIsSubmitted(false);
    clearErrors();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    

   const result = await addTodo(formData, currentPage, activeTodo);

    if (result?.success) {
      handleCloseModal();
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    searchDebounce(value);
  };

  const handleToggle = (e) => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    const theme = newIsDark ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    setIsDark(savedTheme === "dark");
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full">
        <button
          onClick={handleToggle}
          className="ml-auto cursor-pointer p-2 rounded-lg transition"
        >
          {isDark ? <Moon /> : <Sun />}
        </button>
        <h1 className="text-3xl font-semibold mt-4">My Tasks</h1>
        <div className="flex flex-row mt-8 gap-6 w-full max-w-xl px-6">
          <input
            value={search}
            onChange={handleSearchChange}
            type="text"
            placeholder="Search your task here..."
            className="flex-1 px-4 py-2 rounded-2xl border-none outline-none bg-white bg-opacity-100 placeholder-gray-400 text-gray-700 shadow-md"
          />
          <button className="btn" onClick={() => setIsModal(true)}>
            Add
          </button>
        </div>
      </div>

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
              <h2 className="text-2xl font-semibold">Add New Task</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-black cursor-pointer"
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
                  className={`px-4 py-2 rounded-lg border outline-none ${
                    fieldErrors?.todoName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {fieldErrors?.todoName && (
                  <span className="error">{fieldErrors.todoName}</span>
                )}
              </div>

              
              <div className="flex flex-col">
                <label className="font-medium mb-2">Description (Optional)</label>
                <textarea
                  name="description"
                  placeholder="Enter todo detail"
                  value={formData.description}
                  onChange={handleChange}
                  className={`px-4 py-2 rounded-lg border outline-none resize-none ${
                    fieldErrors?.description ? "border-red-500" : "border-gray-300"
                  }`}
                  rows="3"
                />
                {fieldErrors?.description && (
                  <span className="error">{fieldErrors.description}</span>
                )}
              </div>

              {/* Status */}
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
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddTasks;