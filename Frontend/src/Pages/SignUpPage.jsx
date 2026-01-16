import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ListTodo, Loader2Icon } from "lucide-react";
import { useAuthStore } from "../Store/auth-store";
import GoogleLoginButton from "../Components/GoogleLoginButton/GoogleLoginButton";

const SignUpPage = () => {
  const { isSignUp, Signup, fieldErrors, clearErrors } = useAuthStore();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (fieldErrors?.[name]) {
      clearErrors();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Signup(formData);
  };

  return (
    <div className="h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-4 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="bg-black p-3 rounded-lg">
                <ListTodo className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
            <p className="text-sm text-gray-500">Sign up for a new account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none text-black focus:ring-1 focus:ring-blue-500 focus:border-transparent transition"
              />
              <span className="error">{fieldErrors.fullName}</span>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition"
              />
              <span className="error">{fieldErrors.email}</span>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 text-black focus:ring-blue-500 focus:border-transparent transition"
              />
              <span className="error">{fieldErrors.password}</span>
            </div>

            <button
              type="submit"
              disabled={isSignUp}
              className="btn w-full flex items-center justify-center"
            >
              {isSignUp ? (
                <>
                  <Loader2Icon className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-center justifiy-center">
            <p className="text-center text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:text-blue-700 transition"
              >
                Login
              </Link>
            </p>
            <GoogleLoginButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
