import React, {useState} from "react";
import axios from "axios";


function Verifyuser() {
    const [pageState, setPageState] = useState({
        phone: "",
        otp: ""
    })

    const onInput = (e) => {
        setPageState ({
            ...pageState, [e.taget.name]: e.target.value
        })
    }
    const onUserSubmit = async (e) => {
        await axios.post("/verify", pageState)
    }

    return (
        <>
            <input type="tel" onChange={onInput} name= "phone" />
            <input type="text" onChange={onInput} name= "otp" />
            <input type="submit" onClick={onUserSubmit} value= "Verify" />
        </>
    )
}

export default Verifyuser;