import React from "react";
import { useAuthStore } from "../Store/auth-store";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ForgotPasswordPage = () => {
  const [formData, setFormData] = React.useState({ email: "" });
  const { forgotPassword, fieldErrors, clearErrors } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (fieldErrors?.[name]) {
      clearErrors();
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    forgotPassword(formData);
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 ">
      <div className="bg-white rounded-lg shadow-2xl space-y-3 p-6 w-full max-w-md">
        <h1 className="text-black text-xl text-center">
          Forgot Your Password?
        </h1>
        <p className="text-gray-600 text-sm text-center">
          Provide the email address associated with your account
        </p>
        <form onSubmit={handleSubmit} className="space-y-2 mt-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-gray-700 text-sm">
              Email
            </label>
            <input
              value={formData.email}
              name="email"

              onChange={handleChange}
              type="email"
              placeholder="name@example.com"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none text-sm"
            />

            <span className="error">{fieldErrors.email}</span>
            <button className="btn mt-2">Reset Password</button>
          </div>
        </form>

        <p className="text-center text-sm mt-6">
          <Link to="/login">
            <ArrowLeft className="h-6 w-6 inline-block mr-2 mb-1" />
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
