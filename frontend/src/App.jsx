import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./style/app.css";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import AddTask from "./components/AddTask";
import List from "./components/List";
import UpdateTask from "./components/UpdateTask";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Protected from "./components/Protected";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <Protected>
              <List />
            </Protected>
          }
        />

        <Route
          path="/add"
          element={
            <Protected>
              <AddTask />
            </Protected>
          }
        />
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/update/:id" element={<UpdateTask />} />
      </Routes>
    </>
  );
}

export default App;
