import React, { useState, useEffect } from "react";
import { X, Search, Check } from "lucide-react";
import { useAuthStore } from "../../Store/auth-store";
import avatar from "/avatar.png";
import { useTodoStore } from "../../Store/todo-store";

const ShareModal = ({ todo, onClose }) => {
  const { getAllUsers, allUsers,onLineUsers } = useAuthStore();
  const { shareTodo } = useTodoStore();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [permission, setPermission] = useState("view");
  const [searchQuery, setSearchQuery] = useState("");

  if (!todo) return null;

  useEffect(() => {
    getAllUsers();
  }, []);

  console.log("online users are ", onLineUsers)

  const filteredUsers = allUsers?.filter((user) =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const toggleUser = (email) => {
    setSelectedUsers((prev) => {
      const userExist = prev.some((user) => email === user.email);

      return userExist
        ? prev.filter((user) => user.email !== email)
        : [...prev, { email }];
    });
  };

const handleShare = async () => {
  const sharedData = { 
    emails: selectedUsers.map(user => user.email),
    permission: permission 
  };

  console.log("Shared data", sharedData)
  
  try {
    await shareTodo(sharedData, todo._id);
    setSelectedUsers([]); 
    setPermission("view");  
    onClose();  
  } catch (error) {
    console.log("Share failed:", error);
  }
};

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-sm sm:max-w-md lg:max-w-xl  shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-black">Share Todo</h2>
            <p className="text-sm text-gray-500 mt-1">{todo.todoName}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10  cursor-pointer rounded-full text-gray-500 hover:text-gray-900 transition-all flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
            Select Todo Permission Level
          </h3>
          <div className="flex gap-3">
            <label
              className={`flex-1 cursor-pointer transition-all ${
                permission === "view"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-black hover:bg-gray-200"
              } rounded-xl px-4 py-3 text-center font-semibold text-sm`}
            >
              <input
                type="radio"
                name="permission"
                value="view"
                checked={permission === "view"}
                onChange={(e) => setPermission(e.target.value)}
                className="hidden"
              />
              View Only
            </label>
            <label
              className={`flex-1 cursor-pointer transition-all ${
                permission === "edit"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-black hover:bg-gray-200"
              } rounded-xl px-4 py-3 text-center font-semibold text-sm`}
            >
              <input
                type="radio"
                name="permission"
                value="edit"
                checked={permission === "edit"}
                onChange={(e) => setPermission(e.target.value)}
                className="hidden"
              />
              Can Edit
            </label>
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:outline-none focus:border-black focus:bg-white transition-all text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredUsers?.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-400">No cotacts found</p>
            </div>
          ) : (
            filteredUsers?.map((user) => {
              const isSelected = selectedUsers.some(
                (u) => u.email === user.email,
              );
              return (
                <div
                  key={user._id}
                  onClick={() => toggleUser(user.email)}
                  className={`flex items-center gap-4 px-6 py-4 cursor-pointer transition-all border-b border-gray-50 hover:bg-gray-50 ${
                    isSelected
                      ? " bg-gray-700 text-white hover:bg-gray-900"
                      : ""
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                      isSelected
                        ? "bg-white border-white"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 text-black" />}
                  </div>

                  <div className={`relative ${onLineUsers.includes(user._id)? 'avatar-online ':' avatar-offline'}`}>
                    <img
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-100"
                      src={user.profilePic || avatar}
                      alt={user.fullName}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-semibold truncate ${
                        isSelected ? "text-white" : "text-black"
                      }`}
                    >
                      {user.fullName}
                    </p>
                    <p
                      className={`text-sm truncate ${
                        isSelected ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      {user.email}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="p-6 border-t border-gray-100">
          <button
            onClick={handleShare}
            disabled={selectedUsers.length === 0}
            className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all ${
              selectedUsers.length === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-900 active:scale-[0.98]"
            }`}
          >
            {selectedUsers.length === 0
              ? "Select Contacts"
              : `Share with ${selectedUsers.length} ${
                  selectedUsers.length === 1 ? "Contact" : "Contacts"
                }`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
