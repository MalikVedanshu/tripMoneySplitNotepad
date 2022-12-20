import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading";
import Mynavbar from "../navbar";

function GenerateReport() {
    const navigate = useNavigate()
    const [report, setReport] = useState({
        tripexpenses: [],
        tripmembers: [],
        allExpenses: [],
        tripName: "",
    })
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(false);

    /* eslint-disable */
    useEffect(() => {
        async function allTripData() {
            try {
                const token = localStorage.getItem("token");
                if (!token) navigate("/login");
                setLoading(true)
                const res = await axios.get("/api/trip/generatereport", { headers: { "z-auth-token": token } })
                setLoading(false)
                if (res.data.tripName === "") {
                    navigate("/createtrip")
                } else {
                    setReport({
                        tripexpenses: res.data.tripDashboard,
                        tripmembers: res.data.tripmembers,
                        allExpenses: res.data.allExpenses,
                        tripName: res.data.tripName
                    })
                }
            }
            catch (error) {
                
                localStorage.removeItem("token")
                let allErrors = error.response.data;
                typeof (allErrors.error) === "string" ? setErrors(allErrors.error) : setErrors(allErrors.data.response);
                setErrors(error.response.data);
                navigate("/login");
            }
        }
        allTripData();
    }, [])
    /* eslint-disable */


    return (
        <>
            <center>
                <Mynavbar />
                <h2 >{errors}</h2>
                {loading && <Loading />}


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
            </center>
        </>
    )
}

export default GenerateReport;