import React, { useState } from "react";
import axios from "axios";
import Loading from "../Loading.js";
import { useNavigate } from "react-router-dom";
import Mynavbar from '../navbar'


function Createtrip() {
    const navigate = useNavigate()
    const [tripName, setTripName] = useState("");
    const [members, setMembers] = useState(["", ""])
    const [error, setErrors] = useState([]);

    const [loading, setLoading] = useState(false);
    const onMembersChange = (eve) => {
        let tempMember = [...members];
        tempMember[eve.target.name * 1] = eve.target.value;
        setMembers(tempMember);
    }

    const onAddMembers = (eve) => {
        let tempArr = [...members]
        tempArr.push("");
        setMembers(tempArr)
    }



    const onDeleteMembers = (eve) => {
        if (members.length > 2) {
            let tempArr = [...members]
            tempArr.pop();
            setMembers(tempArr)
        }

    }

    const onTripSubmit = async () => {
        try {
            let token = localStorage.getItem("token")
            
            setLoading(true);
            let tripData = { tripName: tripName, members: members };
            await axios.post("/api/trip/generatetrip", tripData, {headers: {"z-auth-token": token}});
            setLoading(false);
            navigate("/dashboard")
        }
        catch (error) {
            setLoading(false);
            let allErrors = error.response.data;
            typeof (allErrors.error) === "string" ? setErrors(allErrors.error) : setErrors(allErrors.error[0].msg);
            setTimeout(() => {
                setErrors("")
            },2000)
        }

    }


    return (
        <>
        <Mynavbar />
        <h1> Create Trip </h1>
            {
                loading && (
                    <Loading />
                )
            }
            <h3 style={{color: "rgb(150, 20, 20)", textAlign: "center"}}>{error}</h3>
            
            <form>
                <label htmlFor="tripName" >Trip Name :</label>
                <input type="text" name='tripName' onChange={(e) => { setTripName(e.target.value) }} placeholder='Choose a name of your trip' /><br /><br />
                <label htmlFor="members" >Enter trip Members (atleast two members should be there to split) :</label>
                {
                    members.map((ele, idx) => (
                        <input key={idx} type="text" name={idx} placeholder={`Member${idx + 1}`} onChange={onMembersChange} />
                    ))
                }
                <input type="button" value="Add Members" onClick={onAddMembers} />
                <input type="button" value="Delete Members" onClick={onDeleteMembers} /><br /> <br />
                <input type="button" value="Create Trip" onClick={onTripSubmit} />
            </form>
        </>
    )
}
export default Createtrip;