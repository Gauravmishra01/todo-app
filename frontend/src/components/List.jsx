import { Fragment, useEffect, useState } from "react";
import "../style/list.css";
import { Link } from "react-router-dom";

export default function List() {
  const [taskData, setTaskData] = useState([]);
  const [selectedTask, setSelectedTask] = useState([]);

  const API = "https://todo-app-ew7f.onrender.com"; // ✅ Correct backend URL

  useEffect(() => {
    getListData();
  }, []);

  // ✅ Fetch All Tasks
  const getListData = async () => {
    let res = await fetch(`${API}/tasks`, {
      credentials: "include",
    });

    let data = await res.json();

    if (data.success) {
      setTaskData(data.result);
    } else {
      alert("Try after some time");
    }
  };

  // ✅ Delete Single Task
  const deleteTask = async (id) => {
    let res = await fetch(`${API}/delete/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    let data = await res.json();

    if (data.success) {
      getListData();
    } else {
      alert("Try after some time");
    }
  };

  // ✅ Select All Items
  const selectAll = (event) => {
    if (event.target.checked) {
      let allIds = taskData.map((item) => item._id);
      setSelectedTask(allIds);
    } else {
      setSelectedTask([]);
    }
  };

  // ✅ Select Single Item
  const selectSingleItem = (id) => {
    if (selectedTask.includes(id)) {
      setSelectedTask(selectedTask.filter((x) => x !== id));
    } else {
      setSelectedTask([...selectedTask, id]);
    }
  };

  // ✅ Delete Multiple Items
  const deleteMultiple = async () => {
    if (selectedTask.length === 0) {
      alert("No tasks selected!");
      return;
    }

    let res = await fetch(`${API}/delete-multiple`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selectedTask),
    });

    let data = await res.json();

    if (data.success) {
      getListData();
      setSelectedTask([]);
    } else {
      alert("Error deleting tasks");
    }
  };

  return (
    <div className="list-container">
      <h1>To Do List</h1>

      <button onClick={deleteMultiple} className="delete-item delete-multiple">
        Delete
      </button>

      <ul className="task-list">
        <div className="list-header">
          <input onChange={selectAll} type="checkbox" />
        </div>
        <div className="list-header">S.NO.</div>
        <div className="list-header">Title</div>
        <div className="list-header">Description</div>
        <div className="list-header">Action</div>

        {taskData.map((item, index) => (
          <Fragment key={item._id}>
            <li className="list-item">
              <input
                type="checkbox"
                checked={selectedTask.includes(item._id)}
                onChange={() => selectSingleItem(item._id)}
              />
            </li>

            <li className="list-item">{index + 1}</li>
            <li className="list-item">{item.title}</li>
            <li className="list-item">{item.description}</li>

            <li className="list-item">
              <button
                onClick={() => deleteTask(item._id)}
                className="delete-item"
              >
                Delete
              </button>

              <Link to={"update/" + item._id} className="update-item">
                Update
              </Link>
            </li>
          </Fragment>
        ))}
      </ul>
    </div>
  );
}
