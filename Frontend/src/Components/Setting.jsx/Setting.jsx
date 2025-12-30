import React, { useRef, useState } from "react";
import { useAuthStore } from "../../Store/auth-store";
import avatarImage from "/avatar.png";
import { Loader2Icon } from "lucide-react";

const Setting = () => {
  const { authUser, isUploading, updateProfile } = useAuthStore();
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

  return (
    <div className="setting  bg-white pt-6 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-8">Settings</h1>

        <div className="border border-gray-300 rounded-lg p-8">
          <form onSubmit={handleSubmit}>
         
            <div className="mb-8">
              <label className="block text-sm font-semibold  mb-4">
                Profile Picture
              </label>
              <button
                type="button"
                onClick={() => fileRef.current.click()}
                className="relative group focus:outline-none cursor-pointer"
              >
                <img
                  src={formData?.profilePic || avatarImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-lg object-cover border border-gray-300"
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
    </div>
  );
};

export default Setting;