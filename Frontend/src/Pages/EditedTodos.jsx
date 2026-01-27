import React from "react";
import { useTodoStore } from "../Store/todo-store";
import { Clock, User, FileEdit } from "lucide-react";
import { useEffect } from "react";
import avatar from "/avatar.png"
import { useAuthStore } from "../Store/auth-store";
const EditedTodos = () => {
  const { getEditedTods, editedTodos } = useTodoStore();
  const {socket} = useAuthStore();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  useEffect(()=>{
    socket.on("todoEdited",(data)=>{
      getEditedTods();
    });

    return ()=>{
      socket.off("todoEdited")
    }
  },[socket])

  useEffect(()=>{
    getEditedTods();
},[])

console.log("edited data is", editedTodos)


  if (editedTodos.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-800 mb-8">Edit History</h1>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <FileEdit className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No edit history available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Edit History</h1>
          <p className="text-slate-600">Track all changes made to your todos</p>
        </div>

        <div className="space-y-4">
          {editedTodos.map((todo,index) => (
            <div 
                key={`${todo.todoId}-${todo.editedBy}-${index}`}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <img src={todo.profilePic || avatar}  className="h-8 - w-8 rounded-full"/>
                  <span className="font-semibold text-slate-800">{todo.editorName} Change</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Clock className="w-4 h-4" />
                  <span>{formatDate(todo.editedAt)}</span>
                </div>
              </div>

              <div className="space-y-3 pl-7">
                {todo.changes.status && (
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-medium text-slate-600 min-w-fit">Status:</span>
                    <span className="text-sm text-slate-800 bg-blue-50 px-3 py-1 rounded-full">
                      {todo.changes.status}
                    </span>
                  </div>
                )}
                
                {todo.changes.description && (
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-medium text-slate-600 min-w-fit mt-2">Description:</span>
                    <span className="text-sm text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg flex-1">
                      {todo.changes.description}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditedTodos;