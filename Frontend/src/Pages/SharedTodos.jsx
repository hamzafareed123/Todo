import React, { useState, useEffect } from "react";
import { useTodoStore } from "../Store/todo-store";
import { Lock, Edit2, Loader } from "lucide-react";
import ViewDetailsModal from "../Components/ViewDetailsModal/ViewDetailsModal";
import TodoForm from "../Components/TodoForm/TodoForm";

const SharedTodos = () => {
  const { getSharedTodos } = useTodoStore();
  const [sharedTodos, setSharedTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTodoForDetail, setSelectedTodoForDetail] = useState(null);
  const [isEditModalOpen,setIsEditModalOpen] = useState(false)
  const [sendEditData,setSendEditData]= useState(null);

  useEffect(() => {
    fetchSharedTodos();
  }, []);

  const fetchSharedTodos = async () => {
    try {
      setLoading(true);
      const todos = await getSharedTodos();
      setSharedTodos(todos);
    } catch (error) {
      console.log("Error fetching shared todos:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }



  if (sharedTodos.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg">No todos shared with you yet</p>
        </div>
      </div>
    );
  }

  const handleEdit= ()=>{
    setIsEditModalOpen(true);
   
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-8">Shared with Me</h1>

        <div className="space-y-4">
          {sharedTodos.map((todo) => {
            const permission = todo.sharedWith[0]?.permission || "view";
            const sharedAt = todo.sharedWith[0]?.sharedAt;
            const creator = todo.userId;

            return (
              <div
                key={todo._id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-black">
                      {todo.todoName}
                    </h2>
                  
                  </div>

                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
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

                <div className="flex items-center gap-4 mb-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full ${
                      todo.status === "completed"
                        ? "bg-green-100 text-green-700"
                        :todo.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        :"bg-red-100 text-red-700"
                    }`}
                  >
                    {todo.status}
                  </span>
                  <span className="text-gray-500">
                    Shared on {new Date(sharedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedTodoForDetail(todo)}
                    className="px-4 py-2  cursor-pointer bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
                  >
                    View Details
                  </button>

                  {permission === "edit" && (
                    <button onClick={()=>{
                       setIsEditModalOpen(true);
                       setSendEditData(todo);
                    }}
                     className="px-4 py-2  cursor-pointer border border-gray-200 text-black rounded-lg hover:bg-gray-50 transition-colors">
                      Edit Todo
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedTodoForDetail && (
        <ViewDetailsModal
          todo={selectedTodoForDetail}
          onClose={() => setSelectedTodoForDetail(null)}
        />
      )}

      {isEditModalOpen && (
        <TodoForm
        sharedTodo={sendEditData}
        onClose={()=>{
          setIsEditModalOpen(false)
           setSendEditData(null)
        }}
        />
      )}
    </div>
  );
};

export default SharedTodos;