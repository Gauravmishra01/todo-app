import { useEffect, useState } from "react";
import "../style/addtask.css";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateTask() {
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
  });

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    getTask(id);
  }, []);

  // 🔥 FIXED — ADDED credentials: "include"
  const getTask = async (id) => {
    let res = await fetch("https://todo-app-ew7t.onrender.com
/task/" + id, {
      credentials: "include",
    });

    let task = await res.json();

    if (task.success) {
      setTaskData({
        title: task.result.title || "",
        description: task.result.description || "",
      });
    } else {
      alert("Unable to load task. Please login again.");
      navigate("/login");
    }
  };

  // 🔥 FIXED — ADDED credentials: "include"
  const updateTask = async () => {
    let res = await fetch("http://localhost:3200/update-task/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // VERY IMPORTANT
      body: JSON.stringify(taskData),
    });

    let task = await res.json();

    if (task.success) {
      navigate("/");
    } else {
      alert("Failed to update task. Please login again.");
      navigate("/login");
    }
  };

  return (
    <div className="container">
      <h1>Update Task</h1>

      <label>Title</label>
      <input
        value={taskData.title}
        onChange={(event) =>
          setTaskData({ ...taskData, title: event.target.value })
        }
        type="text"
        placeholder="Enter task title"
      />

      <label>Description</label>
      <textarea
        value={taskData.description}
        onChange={(event) =>
          setTaskData({ ...taskData, description: event.target.value })
        }
        rows={4}
        placeholder="Enter task description"
      />

      <button onClick={updateTask} className="submit">
        Update Task
      </button>
    </div>
  );
}
