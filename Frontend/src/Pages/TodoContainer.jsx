import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar/Sidebar";
import AddTasks from "../Components/AddTasks/AddTasks";
import TodoList from "../Components/TodoList/TodoList";
import EmptyTodoList from "../Components/EmptyTodoList/EmptyTodoList";
import { useTodoStore } from "../Store/todo-store";
import Setting from "../Components/Setting.jsx/Setting";
import SharedTodos from "./SharedTodos";
import EditedTodos from "./EditedTodos";

const TodoContainer = () => {

  const { selectedTab,getAllTodos, } = useTodoStore();


  useEffect(()=>{
    getAllTodos();
  },[getAllTodos])

  return (
    <div className="flex p-2 " >
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 sm:overflow-y-auto transition-all duration-300 pt-16 ">
        
        {selectedTab === "Tasks" && <TodoList />}
        {selectedTab === "Setting" && <Setting />}
        {selectedTab === "Collaborations" && <SharedTodos/>}
        {selectedTab === "EditedTodos" && <EditedTodos/>}
      </main>
    </div>
  );
};

export default TodoContainer;
