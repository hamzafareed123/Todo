import React, { useState } from "react";
import { Menu, X, ListTodo, Settings, LogOut } from "lucide-react";
import avatarImage from "/avatar.png";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../Store/auth-store";
import { useTodoStore } from "../../Store/todo-store";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { authUser, Logout } = useAuthStore();

  const { setTab } = useTodoStore();

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 menu-icon  p-2 rounded-lg "
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <div
        className={`sidebar-modal fixed md:relative w-64 h-screen shadow-xl  p-6 transition-all duration-300  ${
          isOpen ? "left-0" : "-left-64"
        } md:left-0 z-40 ${isCollapsed ? "md:w-24" : "md:w-64"}`}
      >
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className=" p-2 rounded-lg cursor-pointer transition w-10 h-10 flex items-center justify-center"
          >
            <Menu className="w-5 h-5 menu-icon hidden lg:block sm:hidden" />
          </button>
          {!isCollapsed && (
            <span className="menu-icon text-sm font-semibold text-black">
              Menu
            </span>
          )}
        </div>

        {!isCollapsed && (
          <div className=" bg-opacity-10 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-center flex-col gap-3">
              <img
                src={authUser.profilePic || avatarImage}
                alt="avatar"
                className="w-16 h-16 rounded-full object-cover border-2 border-white"
              />
              <div className="flex flex-col items-center justify-center">
                <h2 className="font-semibold text-md">
                  {authUser?.fullName || "User"}
                </h2>
                <p className="text-xs text-[#707888]">
                  {authUser?.email || "user@example.com"}
                </p>
              </div>
            </div>
          </div>
        )}

        {!isCollapsed && (
          <div className="flex justify-center">
            <hr className="border w-full border-[#6A7282] mb-6" />
          </div>
        )}
        <nav className="space-y-3 flex-1">
          <Link
            onClick={() => {
              setIsOpen(false);
              setTab("Tasks");
            }}
            className={`flex items-center gap-3 rounded-lg  hover:bg-opacity-20 transition duration-200  active:bg-opacity-30 ${
              isCollapsed ? "w-10 h-10 justify-center" : "px-4 py-3 w-full"
            }`}
            title={isCollapsed ? "My Tasks" : ""}
          >
            <ListTodo className="w-5 h-5" />
            {!isCollapsed && <span className="font-medium">My Tasks</span>}
          </Link>

          <Link
            onClick={() => {
              setIsOpen(false);
              setTab("Setting");
            }}
            className={`flex items-center gap-3 rounded-lg  hover:bg-opacity-20 transition duration-200  active:bg-opacity-30 ${
              isCollapsed ? "w-10 h-10 justify-center" : "px-4 py-3 w-full"
            }`}
            title={isCollapsed ? "Settings" : ""}
          >
            <Settings className="w-5 h-5" />
            {!isCollapsed && <span className="font-medium">Settings</span>}
          </Link>
        </nav>
      </div>

      {isOpen && (
        <div
          className="sidebar fixed inset-0 bg-opacity-50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
