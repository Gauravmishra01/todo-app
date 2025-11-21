import { useState } from "react";
import "../style/addtask.css";
import { useNavigate } from "react-router-dom";

export default function AddTask() {
  const [taskData, setTaskData] = useState({});
  const navigate = useNavigate();

  const handleAddTask = async () => {
    console.log(taskData);

    let result = await fetch("http://localhost:3200/add-task", {
      method: "POST",
      body: JSON.stringify(taskData),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    result = await result.json();

    if (result.success) {
      navigate("/");
      console.log("new task added");
    } else {
      alert("try after some time");
    }
  };

  return (
    <div className="container">
      <h1>Add New Task</h1>

      <label>Title</label>
      <input
        onChange={(event) =>
          setTaskData({ ...taskData, title: event.target.value })
        }
        type="text"
        name="title"
        placeholder="Enter task title"
      />

      <label>Description</label>
      <textarea
        onChange={(event) =>
          setTaskData({ ...taskData, description: event.target.value })
        }
        rows={4}
        name="description"
        placeholder="Enter task description"
      ></textarea>

      <button onClick={handleAddTask} className="submit">
        Add New Task
      </button>
    </div>
  );
}
