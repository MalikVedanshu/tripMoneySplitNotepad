import React from "react";
import { Link } from "react-router-dom";

function Mynavbar() {
    // const [user, setUser] = useState(null);
    return (
        <>
            <nav className="nav">
                <div className="navEl"><Link style={{ textDecoration: "none", color: "rgba(234, 236, 236, 0.857)" }} to="/dashboard">Manage Expense </Link></div>
                {/* <div className="navEl"><Link style={{ textDecoration: "none", color: "rgba(234, 236, 236, 0.857)" }} to="/createtrip">Create Trip </Link></div> */}
                {/* <div className="navEl"><Link style={{ textDecoration: "none", color: "rgba(234, 236, 236, 0.857)" }} to="/addtripdata">Add Expenses </Link></div> */}
                {/* <div className="navEl"><Link style={{ textDecoration: "none", color: "rgba(234, 236, 236, 0.857)" }} to="/viewtrip">View/Edit Trip </Link></div> */}
                <div className="navEl"><Link style={{ textDecoration: "none", color: "rgba(234, 236, 236, 0.857)" }} to="/profile">Edit Profile </Link></div>
            </nav>
        </>
    )
}
export default Mynavbar;