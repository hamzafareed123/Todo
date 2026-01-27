import { useEffect } from "react";
import "./App.css";
import LoginPage from "./Pages/LoginPage";
import SignUpPage from "./Pages/SignUpPage";
import TodoContainer from "./Pages/TodoContainer";
import { useAuthStore } from "./Store/auth-store";
import { Routes, Route, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Toaster } from "react-hot-toast";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import ResetPasswrodPage from "./Pages/ResetPasswrodPage";
import toast from "react-hot-toast";

function App() {
  const {
    authUser,
    isCheckingAuth,
    checkAuth,
    connectSocket,
    disConnectSocket,
    socket,
    addNotification,
    addUpdatedNotifications
  } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (authUser) {
      connectSocket();
    } else if (!authUser) {
      disConnectSocket();
    }
  }, [authUser]);

  
 useEffect(() => {
  if (socket) {
    const handleTodoShared = (data) => {
      addNotification();
      console.log("Notification received:", data);
      toast.success(`${data.sharedBy} shared Task with you`);
    };

    const handleTodoUpdated = (data) => {
      addUpdatedNotifications();
      console.log(data);
      toast.success(`${data.updatedBy} update todo`);
    };

    socket.on("todoSharedNotification", handleTodoShared);
    socket.on("updatedTodoNotification", handleTodoUpdated);

    return () => {
      socket.off("todoSharedNotification", handleTodoShared);
      socket.off("updatedTodoNotification", handleTodoUpdated);
    };
  }
}, [socket, addNotification]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-200 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={authUser ? <TodoContainer /> : <Navigate to="/signup" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />

        <Route path="/tasks" />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/reset-password" element={<ResetPasswrodPage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;