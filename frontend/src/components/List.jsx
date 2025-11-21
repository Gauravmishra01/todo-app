import { Fragment, useEffect, useState } from "react";
import "../style/list.css";
import { Link } from "react-router-dom";

export default function List() {
  const [taskData, setTaskData] = useState([]);
  const [selectedTask, setSelectedTask] = useState([]);

  useEffect(() => {
    getListData();
  }, []);

  const getListData = async () => {
    let list = await fetch("https://todo-app-ew7t.onrender.com")
/tasks", {
      credentials: "include",
    });
    list = await list.json();

    if (list.success) {
      setTaskData(list.result);
    } else {
      alert("Try after some time");
    }
  };

  const deleteTask = async (id) => {
    let item = await fetch("http://localhost:3200/delete/" + id, {
      method: "delete",
      credentials: "include",
    });

    item = await item.json();

    if (item.success) {
      getListData();
    } else {
      alert("Try after some time");
    }
  };

  const selectAll = (event) => {
    if (event.target.checked) {
      let allIds = taskData.map((item) => item._id);
      setSelectedTask(allIds);
    } else {
      setSelectedTask([]);
    }
  };

  const selectSingleItem = (id) => {
    if (selectedTask.includes(id)) {
      setSelectedTask(selectedTask.filter((x) => x !== id));
    } else {
      setSelectedTask([...selectedTask, id]);
    }
  };

  const deleteMultiple = async () => {
    if (selectedTask.length === 0) {
      alert("No tasks selected!");
      return;
    }

    let response = await fetch("http://localhost:3200/delete-multiple", {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selectedTask),
    });

    const result = await response.json();

    if (result.success) {
      getListData(); // refresh list
      setSelectedTask([]); // clear selection
    } else {
      alert("Error deleting tasks");
    }
  };

  return (
    <div className="list-container">
      <h1>To Do List</h1>

      {/* Delete Multiple Button */}
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
