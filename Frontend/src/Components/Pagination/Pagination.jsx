import React, { useEffect, useState } from "react";
import { useTodoStore } from "../../Store/todo-store";

const Pagination = ({activeTodo}) => {
  const {
    totalTodos,
    getPageTodos,
    totalSearchCount,
    inputValue,
    searchTodos,
  } = useTodoStore();
  const [currentPage, setCurrentPage] = useState(1);
  
  const isSearching = inputValue && inputValue.trim();

  const total = isSearching ? totalSearchCount : totalTodos;

  const totalPages = Math.ceil(total / 5);

   console.log("total:", total);
  console.log("totalPages:", totalPages);
  console.log("totalTodos:", totalTodos);
  console.log("allTodos length:", useTodoStore.getState().allTodos?.length);

  useEffect(() => {
    setCurrentPage(1);
  }, [isSearching,activeTodo]);

  const handlePageClick = (page) => {
    setCurrentPage(page);
  
    if (isSearching) {
      searchTodos(inputValue, page, 5);
    } else {
      getPageTodos(page, 5,activeTodo);
    }
  };

  return (
    <div className="  w-full mt-6 ">
      {total > 1 && (
        <div className="flex gap-4 items-center justify-between">
          <p>
            {" "}
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageClick(index + 1)}
                className={` px-3 py-1 border rounded-xl cursor-pointer transition  ${
                  currentPage === index + 1
                    ? "bg-gray-500 text-white border-gray-500"
                    : "bg-white text-black border-gray-300 hover:bg-gray-100"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Pagination;
