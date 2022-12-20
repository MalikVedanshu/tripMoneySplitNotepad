import React from 'react';
import Home from './components/home.js';
import About from './components/about.js';
import Forgotpassword from './components/forgotpass';
import Login from './components/login.js';
import Register from './components/register.js';
import Dashboard from './components/dashboard.js';
import Createtrip from './components/Dashboard/createtrip.js';
// import Addtripdata from './components/Dashboard/addTripData.js';
import Viewtrips from './components/Dashboard/seeExistingTrip.js';
import EditTripData from './components/Dashboard/EditTripModal.js';
import Profiledit from './components/Dashboard/profile.js';
import Verifyuser from './components/verifyUser.js';
import Generatereport from './components/Dashboard/generateReport.js';

import './App.css';

import { Routes, Route} from "react-router-dom";
function App() {
  return (
    <Routes>
      <Route path="/" element = {<Home />}></Route>
      <Route path="/login" element= {<Login />}></Route>
      <Route path="/register" element = {<Register />}></Route>
      <Route path="/about" element = {<About />}></Route>
      <Route path="/forgotpassword" element = {<Forgotpassword />}></Route>
      <Route path="/dashboard" element = {<Dashboard />}></Route>
      <Route path="/createtrip" element = {<Createtrip />}></Route>
      {/* <Route path="/addtripdata" element = {<Addtripdata />}></Route> */}
      <Route path="/generatereport" element = {<Generatereport />}></Route>
      <Route path="/editexpensedata" element = {<EditTripData />}></Route>
      {/* <Route path="/editexpensedata/*" element = {<EditTripData />}></Route> */}
      <Route path="/viewtrip" element ={<Viewtrips />}></Route>
      <Route path="/profile" element={<Profiledit />}></Route>
      <Route path="/verify" element={<Verifyuser />}></Route>
      <Route path="/*" element={<Login />}></Route>
      
    </Routes>
  );
}

export default App;
