import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Mynavbar from "./navbar";
import Logoutbtn from './logoutbutton';
import Addtripdata from "./Dashboard/addTripData";
// import Modal from 'react-modal';
import Loading from "./Loading";


function Dashboard() {
    
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState("")

    

    // const [report, setReport] = useState({
    //     tripexpenses: [],
    //     tripmembers: [],
    //     allExpenses: [],
    //     tripName: "",
    // })
/* eslint-disable */
    useEffect(() => {
        async function allTripData() {
            try {
                const token = localStorage.getItem("token");
                if (!token) navigate("/login");
                setLoading(true);
                const res = await axios.get("/api/trip/generatereport", { headers: { "z-auth-token": token } })
                setLoading(false);
                if (res.data.tripName === "") {
                    return navigate("/createtrip")
                } 
                
            }
            catch (error) {
                
                localStorage.removeItem("token")
                let allErrors = error.response.data;
                typeof (allErrors.error) === "string" ? setErrors(allErrors.error) : setErrors(allErrors.data.response);
                setErrors(error.response.data);
                navigate("/login")
            }
        }
        
        allTripData();
    },[])
    /* eslint-disable */

    return (
        <>

            <center>
             
                <Mynavbar />
                {loading && <Loading />}
                <h3 style={{ color: "red", textAlign: "center" }}>{errors}</h3>



                {
                    <div>
                        
                            <div style={{ backgroundColor: "rgb(30,30,30)", border: "2px solid", borderRadius: "7px", padding: "6px 12px" }}><Addtripdata /> </div> <br />
                            
                            <div>
                                {/* <input type="button" onClick={() => setOpenReportModal(true)} value= "Show settlement amount" /> */}
                            {/* <Modal isOpen= {openReportModal}
                            style={{
                                overlay: {
                                    backgroundColor: 'rgba(25, 25, 25, 0.075)'
                                }, content: {
                                    backgroundColor: 'rgb(10, 72, 50)',
                                    color: 'rgba(255, 255, 255, 0.75)'
                                }
                            }}>
                                <center>
                                <table>
                                    <thead>
                                        <tr>
                                            {
                                                report.tripmembers.length > 0 ? report.tripmembers.map((ele, idx) => (
                                                    <th key={idx} style={{ borderRadius: "6px", backgroundColor: "rgb(32,32,32)", width: "20%" }}>{ele}</th>
                                                )) : <th style={{ borderColor: "transparent", backgroundColor: "rgb(32,32,32)" }}> No Trip Generated </th>
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            {
                                                report.tripexpenses.length > 0 ? report.tripexpenses.map((elem, indx) => (
                                                    <td key={indx} style={{ borderRadius: "6px", backgroundColor: "rgb(32,32,32)" }}>
                                                        {
                                                            elem.length > 0 ? elem.map((elemente, indxx) => (
                                                                <div key={indxx}>{`Pay Rs. ${elemente[1]} to ${elemente[0]} `} </div>
                                                            )) : <div style={{ borderColor: "transparent" }}></div>
                                                        }
                                                    </td>
                                                )) : <td style={{ borderColor: "transparent" }}></td>
                                            }
                                        </tr>
                                    </tbody>
                                </table> <br />
                                <input type="button" onClick={() => setOpenReportModal(false)} value= "Close" />
                                </center>
                                </Modal> */}
                                </div>
                                 <br />
                            <input type="button" onClick={() => navigate("/generatereport")} value="Generate Report" />
                            <input type="button" onClick={() => navigate("/viewtrip")} value="View and Edit Expenses" />
                            <Logoutbtn />
                    </div>
                }

            </center>
        </>
    )
}
export default Dashboard;