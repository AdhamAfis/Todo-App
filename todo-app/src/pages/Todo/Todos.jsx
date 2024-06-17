import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { PlusCircleIcon } from "@heroicons/react/outline";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../../components/Navbar/Navbar";
import { getNameFromEmail, capitalizeFirstTwoWords } from "../../utils/helper";

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseUser = await axiosInstance.get("/user");
        if (responseUser.status === 200 && responseUser.data) {
          setUserInfo(responseUser.data);
        }

        const responseTodos = await axiosInstance.get("/todos");
        if (responseTodos.status === 200 && responseTodos.data) {
          setTodos(responseTodos.data);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.clear();
          navigate("/");
        } else {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [navigate]);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a todo title");
      return;
    }
    try {
      const response = await axiosInstance.post("/todos", { title });
      setTodos([response.data, ...todos]);
      setTitle("");
      toast.success("Todo added successfully");
    } catch (error) {
      console.error("Error adding todo:", error);
      toast.error("Failed to add todo");
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      const response = await axiosInstance.put(`/todos/${id}`, { completed });
      setTodos(todos.map((todo) => (todo.id === id ? response.data : todo)));
    } catch (error) {
      console.error("Error toggling todo completion:", error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axiosInstance.delete(`/todos/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
      toast.success("Todo deleted successfully");
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast.error("Failed to delete todo");
    }
  };

  return (
    <section className="bg-slate-200 min-h-screen">
      <Navbar userInfo={userInfo} />
      <div className="max-w-lg mx-auto py-10 px-4">
        {userInfo && (
          <h2 className="text-3xl font-bold mb-6 text-center">
            Welcome, {capitalizeFirstTwoWords(getNameFromEmail(userInfo.email))}
            !
          </h2>
        )}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form className="mb-6">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add a new todo"
              className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:border-blue-500"
            />
          </form>
          {todos.length > 0 ? (
            <div className="mt-4">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className="p-3 border rounded-md shadow-sm mb-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() =>
                          handleToggleComplete(todo.id, !todo.completed)
                        }
                        className="form-checkbox h-5 w-5 text-blue-500"
                      />
                      <span
                        className={`ml-3 ${
                          todo.completed ? "line-through text-gray-500" : ""
                        }`}
                      >
                        {todo.title}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="text-red-500 hover:text-red-600 focus:outline-none"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center mt-4">No todos found.</p>
          )}
        </div>
        <div className="flex justify-center mt-6">
          <button
            className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition-colors duration-300 focus:outline-none"
            onClick={handleAddTodo}
          >
            <PlusCircleIcon className="w-6 h-6 mr-2" />
            Add New Todo
          </button>
        </div>
      </div>
      <ToastContainer position="bottom-right" newestOnTop={true} />
    </section>
  );
};

export default Todos;
