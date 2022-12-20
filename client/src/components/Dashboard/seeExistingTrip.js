import axios from "axios";
import React, { useState, useEffect } from "react";
// import Logoutbtn from "../logoutbutton";
import { useNavigate } from "react-router-dom";
// import EditTripData from './EditTripModa'
// import EditTripData from "./EditTripModal";
import Mynavbar from "../navbar";
import Modal from 'react-modal';
import Loading from '../Loading.js';


function Viewtrips() {
    const navigate = useNavigate();
    const [allExpenseData, setExpenseData] = useState([])
    const [allMembers, setAllMembers] = useState([])
    const [myTripName, setMyTripName] = useState("")
    // const [editModal, setEditModal] = useState(false);
    const [errorvals, setErrorVals] = useState("")
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [networkResponse, setNetworkResponse] = useState("")

    /* eslint-disable */
    useEffect(() => {
        async function getExpense() {
            try {
                let token = localStorage.getItem("token");
                let res = await axios.get("/api/trip/getallexpensedata", { headers: { "z-auth-token": token } })

                setExpenseData(res.data.expenses);
                setAllMembers(res.data.members);
                setMyTripName(res.data.tripName);
            }
            catch (error) {
                let allErrors = error.response.data;
                typeof (allErrors.error) === "string" ? setErrorVals(allErrors.error) : setErrorVals(allErrors.data.response);
                setErrorVals(error.response.data);
                navigate("/login")
            }
        }
        getExpense();
    }, [])
    /* eslint-disable */

    const deleteThisTrip = async () => {
        try {
            let token = localStorage.getItem("token")
            let res = await axios.delete(`/api/trip/deletecurrenttrip`, { headers: { "z-auth-token": token } })
            setNetworkResponse(res.data.msg);
            setTimeout(() => {
                setNetworkResponse("");
            }, 2000)
            navigate("/dashboard")
        }
        catch (error) {
            let allErrors = error.response.data;
            typeof (allErrors.error) === "string" ? setErrorVals(allErrors.error) : setErrorVals(allErrors.error[0].msg);
            setLoading(false);
            setTimeout(async () => {
                setErrorVals("")
                navigate("/login");
            }, 3000)
            return;
        }
    }




    const onEditReq = async (eve) => {
        try {
            let token = localStorage.getItem("token")
            let expid = eve.target.name;
            let expData = await axios.get(`/api/trip/atrip/${expid}`, { headers: { "z-auth-token": token } })

            localStorage.setItem("editID", expData.data.expenseDetails._id)
            navigate(`/editexpensedata`);
        }

        catch (error) {
            let allErrors = error.response.data;
            typeof (allErrors.error) === "string" ? setErrorVals(allErrors.error) : setErrorVals(allErrors.error[0].msg);
            setLoading(false);
            setTimeout(async () => {
                setErrorVals("")
                navigate("/login");
            }, 3000)
            return;
        }

    }
    const onModalClose = () => {
        setOpenModal(true);
    }


    return (
        <>
            <Mynavbar />
            <center>
                {
                    myTripName !== "" && <h1> {myTripName}</h1>
                }
                {
                    errorvals !== "" && (<p style={{ color: "rgb(150, 20, 20)" }}>{errorvals} </p>)
                }
                {
                    loading && <Loading />
                }
                {
                    networkResponse !== "" && (<h3 style={{ color: "green" }}>{errorvals} </h3>)
                }

                <table>
                    <thead>
                        <tr>
                            {allMembers.length > 0 && (<th>Expense Name </th>)}
                            {allMembers.length > 0 ? allMembers.map((elemen, indxxx) => (
                                <th key={indxxx}>{elemen}</th>
                            )) : <th style={{ borderColor: "transparent" }}></th>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            allExpenseData.length > 0 ? allExpenseData.map((ele, idx) => (
                                <tr key={idx}>
                                    <td>
                                        <div>{ele.expenseFor}</div>
                                        <input type="button" name={`${ele._id}`} value="✏️" onClick={onEditReq} style={{ width: "auto", height: "auto", textAlign: "center", alignItems: "center", backgroundColor: "black", padding: "0 0" }} />
                                    </td>
                                    {
                                        allMembers.map((elem, indxx) => (
                                            <td key={indxx}>
                                                <div name={`spent-${ele._id}`} >{`Spent: ${ele.moneySpentBy[indxx]}`}</div>
                                                <div name={`consumed-${ele._id}`}>{`Consumed: ${ele.moneyConsumedBy[indxx] === false ? "🙅‍♂️" : "✅"}`}</div>

                                            </td>
                                        ))
                                    }
                                </tr>
                            ))

                                : <tr style={{ borderColor: "transparent" }}></tr>
                        }
                    </tbody>
                </table>
                <div>
                    <center>
                        <Modal isOpen={openModal} >
                            <h1 style={{ color: "black" }}>Are you sure? </h1>
                            <input type="text" placeholder="delete" />
                            <input type="button" value="Confirm, delete" onClick={deleteThisTrip} />
                            <input type="button" value="no, cancel" onClick={() => { setOpenModal(false) }} />
                        </Modal>
                        {/* <input type="button" onClick={submitTripExpense} value="Add Expense" /> */}
                        <input type="button" onClick={onModalClose} style={{ width: "auto", height: "auto", marginTop: "2rem", textAlign: "center" }} value="Delete Current Trip" />
                    </center>
                </div>
            </center>
        </>

    )
}

export default Viewtrips;
