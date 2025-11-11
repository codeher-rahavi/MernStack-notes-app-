import React, { Fragment } from "react"
import Home from "./pages/home/home";
import Login from "./pages/login/login";
import SignUp from "./pages/signUp/signUp";
import { Route, Routes } from "react-router-dom";



const App = () => {
  return (
    <Fragment>
      <div>
        <Routes>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
        </Routes>
      </div>
    </Fragment>

  )
}
export default App;