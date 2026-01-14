import React from "react";
import googleIcon from "/googleIcon.png"

const GoogleLoginButton = () => {
    const handleGoogleLogin = ()=>{
        window.location.href="http://localhost:8000/api/google"
    }
  return (
    <div>
      <button
        onClick={handleGoogleLogin}
        className="flex items-center gap-3 px-4 py-2 cursor-pointer rounded-lg hover:bg-gray-100 transition"
      >
        <img
          src={googleIcon}
          alt="Google"
          className="w-5 h-5"
        />
        Continue with Google
      </button>
    </div>
  );
};

export default GoogleLoginButton;
