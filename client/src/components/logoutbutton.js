import React from "react";
import { useNavigate } from "react-router-dom";


export default function Logoutbtn() {
    const navigate = useNavigate();
    const signmeout = (e) => {
        localStorage.removeItem("token")
        navigate("/login");
    }

    return (
        <>
        <center>
            <input type="button" onClick={signmeout} style={{width: "18%",height: "auto", marginTop: "2rem",textAlign: "center"}} value ="Logout" />
        </center>
        </>
    )
}