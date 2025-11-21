import { useState } from "react";
import "../style/addtask.css";
import { useNavigate } from "react-router-dom";

export default function AddTask() {
  const [taskData, setTaskData] = useState({});
  const navigate = useNavigate();

  const API = "https://todo-app-ew7f.onrender.com"; // ✅ Your correct backend URL

  const handleAddTask = async () => {
    let res = await fetch(`${API}/add-task`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });

    let result = await res.json();

    if (result.success) {
      console.log("New task added");
      navigate("/");
    } else {
      alert("Try after some time");
    }
  };

  return (
    <div className="container">
      <h1>Add New Task</h1>

      <label>Title</label>
      <input
        type="text"
        placeholder="Enter task title"
        onChange={(event) =>
          setTaskData({ ...taskData, title: event.target.value })
        }
      />

      <label>Description</label>
      <textarea
        rows={4}
        placeholder="Enter task description"
        onChange={(event) =>
          setTaskData({ ...taskData, description: event.target.value })
        }
      ></textarea>

      <button onClick={handleAddTask} className="submit">
        Add New Task
      </button>
    </div>
  );
}
