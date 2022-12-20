import React from "react";
import { Link } from "react-router-dom";
// import Logoutbtn from "./logoutbutton";


function Home() {
    
    return (
        <>
            <nav className="nav">
                    <div className="navEl"> <Link style={{ textDecoration: "none", color: "rgba(234, 236, 236, 0.857)" }} to="/login">Login </Link> </div>
                    <div className="navEl"><Link style={{ textDecoration: "none", color: "rgba(234, 236, 236, 0.857)" }} to="/register">Register </Link></div>
                    
            </nav>
            <center>
            <h2> Trip Money Splitter </h2>
            <h4> This app provide service to the customers where they no longer have to worry about spliting money while paying randomly throughout a Tour/Trip.</h4> <br />
            <h3> How to use ?</h3>
            <h4> 1. Create account 2. Login 3.Create trip 4. Add expenses </h4>
            <h4> Generate report will calculate the expenses on behalf of you </h4>
            </center>
            {/* <Logoutbtn /> */}

        </>
    )
}
export default Home;