import React, { useRef, useState } from "react";
import { useAuthStore } from "../../Store/auth-store";
import avatarImage from "/avatar.png";
import { Loader2Icon,LogOutIcon } from "lucide-react";

const Setting = () => {
  const { authUser, isUploading, updateProfile,LogOut } = useAuthStore();
  const [isLogout,setIsLogout]= useState(false);
  const [formData, setFormData] = useState({
    profilePic: authUser?.profilePic || "",
    fullName: authUser?.fullName || "",
    email: authUser?.email || "",
  });

  console.log("authUser is ", authUser);

  const fileRef = useRef();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const sendData = new FormData();
    sendData.append("fullName", formData.fullName);
    sendData.append("email", formData.email);
    if (formData.profilePic && formData.profilePic !== authUser?.profilePic) {
      const file = fileRef.current.files[0];
      if (file) sendData.append("profilePic", file);
    }
    updateProfile(sendData);
  };

  const handleLogout  = ()=>{
    LogOut();

  }

  return (
<div className="setting bg-white pt-6 px-4 mt-10 lg:mt-0 sm:mt-10 md:mt-0">
      <div className="max-w-3xl mx-auto">
       

       <div className="flex items-center justify-between mb-8 ">
         <h1 className="text-3xl font-bold text-black ">Settings</h1>
       
         <button className="btn" onClick={(e)=>setIsLogout(true)}>  <LogOutIcon className="w-6 h-6  "/>Logout</button>
       </div>

        <div className="border border-gray-300 rounded-lg p-8">
          <form onSubmit={handleSubmit}>
         
            <div className="flex flex-col items-center justify-center mb-8">
              <label className="block text-sm font-semibold  mb-4">
                Profile Picture
              </label>
              <button
                type="button"
                onClick={() => fileRef.current.click()}
                className="relative group cursor-pointer"
              >
                <img
                  src={formData?.profilePic || avatarImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover "
                />

                <div
                  className="
                      absolute inset-0 rounded-lg
                    bg-black/60
                      flex items-center justify-center
                      opacity-0 group-hover:opacity-100
                      transition-opacity duration-200
                       "
                >
                  {!isUploading ? (
                    <span className="text-white text-xs font-medium">
                      Change
                    </span>
                  ) : (
                    <Loader2Icon className="w-5 h-5 text-white animate-spin" />
                  )}
                </div>
              </button>
              <input
                type="file"
                ref={fileRef}
                onChange={handleImage}
                className="hidden"
                accept="image/*"
              />
            </div>

         
            <div className="mb-6">
              <label className="block text-sm font-semibold  mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 "
              />
            </div>

            
            <div className="mb-8">
              <label className="block text-sm font-semibold  mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 "
              />
            </div>


            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isUploading}
                className="btn flex-1   disabled:bg-gray-500 transition"
              >
                {isUploading ? "Updating..." : "Update Profile"}
              </button>
         
            </div>
          </form>
        </div>
      </div>

      {isLogout && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="logout-modal rounded-lg p-4 py-6 w-full max-w-sm sm:max-w-sm md:max-w-md mx-auto shadow-lg">
            <h2 className=""> Are you sure you want to logout?</h2>
            <div className="flex justify-end gap-8 mt-6">
              <button
                onClick={() => setIsLogout(false)}
                className=" cursor-pointer px-2 py-1 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsLogout(false);
                  handleLogout();
                }}
                className="btn"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Setting;