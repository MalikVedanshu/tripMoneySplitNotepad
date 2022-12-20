import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from "./Loading.js";
import { Link, useNavigate } from "react-router-dom";


function Login() {
    
    const navigate = useNavigate();
    let [loginVals, setLoginVals] = useState({
        username: "",
        password: ""
    })
    

    let [loading, setLoading] = useState(false);
    let [errorVals, setErrorVals] = useState("");
    /* eslint-disable */
    useEffect(() => {
        console.log("rendering");
        let token = localStorage.getItem("token");
        if(token) navigate("/dashboard");
    })
/* eslint-disable */
    

    let { username, password } = loginVals;

    const onLoginChange = (e) => {
        setLoginVals({ ...loginVals, [e.target.name]: e.target.value })
    }
    const onUsrSubmit = async (e) => {
        try {
            console.log()
            e.preventDefault();
            setLoading(true);
            let res = await axios.post("/api/users/login", loginVals)
            setLoading(false);  
            console.log(res.data);
            if (res.data.token) {
                localStorage.setItem("token", res.data.token);
                
                navigate("/dashboard");
            }
            if (res.data.msg) {
                navigate("/about");
            }

        }
        catch (error) {
            setLoading(false);
            console.log(error);
            let allErrors = error.response.data;
            console.log(error);
            typeof (allErrors.error) === "string" ? setErrorVals(allErrors.error) : setErrorVals(allErrors.error[0].msg);
            setTimeout(async () => {
                setErrorVals("")
                // navigate("/login");
            }, 3000)
            return;
        }
    }
    
    return (
        <>
        <div style={{height: "100%"}}>
            <h1>User Login</h1>
            <hr />
            {loading && <Loading />}
            {
                errorVals !== "" && (<h2 style={{ color: "rgb(130, 20, 20)" }}>{errorVals} </h2>)
            }

            {
                !loading &&

                <form>
                    <label htmlFor="username" > Username </label><br />
                    <input type="text" name='username' onChange={onLoginChange} value={username} placeholder='Enter your username ' /><br /><br />
                    <label htmlFor="password" >Password </label><br />
                    <input type="password" name='password' onChange={onLoginChange} value={password} placeholder='Enter your password' /><br /><br />
                    
                    
                    
                    <input type="button" onClick={onUsrSubmit} value='Login' className='clickbutton' />
                    
                </form>
            }
            <p> New user ? <Link style={{ textDecoration: "none", color: "rgba(19, 184, 221, 0.857)" }} to='/register' >Register </Link> </p>
            <p> Forgot Password/Username ? <Link style={{ textDecoration: "none", color: "rgba(19, 184, 221, 0.857)" }} to='/forgotpassword' > Click here </Link> </p>
            </div>
        </>
    )
}
export default Login;