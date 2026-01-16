import React from "react";
import { useAuthStore } from "../Store/auth-store";
import { useNavigate } from "react-router-dom";

const ResetPasswrodPage = () => {
  const [formData, setFormData] = React.useState({ newPassword: "" });
  const { resetPassword, fieldErrors, clearErrors } = useAuthStore();

  const navigate = useNavigate();

  const handleChange = (e)=>{
    const {name,value}= e.target;

    setFormData({...formData,[name]:value});
    if(fieldErrors?.[name]){
      clearErrors()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await resetPassword(formData);
    if (result.success) {
      navigate("/login");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="bg-white rounded-lg shadow-2xl space-y-3 p-6 w-full max-w-md">
        <h1 className="text-black text-xl text-center">
          Reset Account Password
        </h1>
        <p className="text-gray-600 text-sm text-center">
          Enter new Password for your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 text-sm">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none text-sm"
            />
            <span className="error">{fieldErrors.newPassword}</span>
          </div>
          <button className="btn mt-2">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswrodPage;
