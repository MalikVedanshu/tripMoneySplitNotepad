import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '../Loading';
// import { EditExpenseContext } from './seeExistingTrip';
import Mynavbar from '../navbar';
import { useNavigate } from 'react-router-dom';

function EditTripData() {
    const navigate = useNavigate();


    const [expenseFor, setExpenseFor] = useState("");
    const [members, setMembers] = useState([])
    const [spenders, setSpenders] = useState([])
    const [consumers, setConsumers] = useState([])
    const [loading, setLoading] = useState(false)
    const [tickAll, setTickAll] = useState(false);
    let [errorVals, setErrorVals] = useState("");
    let [networkResponse, setNetworkResponse] = useState("");


    /* eslint-disable */
    useEffect(() => {
        
        async function allMembers() {
            try {
                const token = localStorage.getItem("token");
                let editId = localStorage.getItem("editID")
                if (!editId) navigate("/dashboard")
                let res = await axios.get(`/api/trip/atrip/${editId}`, { headers: { "z-auth-token": token } })

                let consumerArr = res.data.expenseDetails.moneyConsumedBy;
                let spenderArr = res.data.expenseDetails.moneySpentBy;
                setMembers(res.data.members);
                setSpenders(spenderArr)
                setConsumers(consumerArr)
                setExpenseFor(res.data.expenseDetails.expenseFor)
            }
            catch (error) {
                
                localStorage.removeItem("token");
                navigate("/dashboard");
            }
        }
        allMembers();
    }, [])
    /* eslint-disable */

    const onTickAll = (eve) => {
        if (tickAll === false) {
            let tempArr = consumers.map(ele => true)
            setTickAll(true);
            setConsumers(tempArr)
        }
        else {
            let tempArr = consumers.map(ele => false)
            setTickAll(false);
            setConsumers(tempArr)
        }

    }



    const onMoneyInput = (eve) => {
        let tempArr = [...spenders]
        let indxx = +eve.target.name.split('-')[1]
        tempArr[indxx] = +eve.target.value;
        setSpenders(tempArr)
    }

    const tickEditMembers = (eve) => {
        if (tickAll === true) {
            let tempArr = consumers.map(ele => true)
            setConsumers(tempArr)
        } else {
            let tempArr = [...consumers]
            let indxx = +eve.target.name.split('-')[1]
            tempArr[indxx] = !tempArr[indxx]
            setConsumers(tempArr)
        }
    }

    const submitTripExpense = async () => {
        try {
            const editId = localStorage.getItem("editID")
            if (!editId) return navigate("/dashboard");
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) return navigate("/login")
            let expenseData = { expenseFor: expenseFor, moneySpentBy: spenders, moneyConsumedBy: consumers };
            let res = await axios.put(`/api/trip/edit/${editId}`, expenseData, { headers: { "z-auth-token": token } });
            setNetworkResponse(res.data.msg);
            setTimeout(() => {
                setNetworkResponse("");
            }, 2000)
            setLoading(false);
        }
        catch (error) {
            setLoading(true);
            let allErrors = error.response.data;
            typeof (allErrors.error) === "string" ? setErrorVals(allErrors.error) : setErrorVals(allErrors.error[0].msg);
            setTimeout(async () => {
                setErrorVals("")
            }, 3000)
            setLoading(false);
        }
    }


    return (
        <>
            <Mynavbar />
            {
                loading && (<Loading />)
            }
            {
                networkResponse !== "" && (<h3 style={{ color: "green" }}>{networkResponse} </h3>)
            }
            {/* <h1>Add Expense</h1> */}
            <h3 style={{ color: "rgb(150, 20, 20)", textAlign: "center" }}>{errorVals}</h3>
            <form>
                {members.length !== 0 && <input type="text" placeholder='Expense for ?' onChange={(eve) => { setExpenseFor(eve.target.value) }} defaultValue={expenseFor} />}
                <div className="addexp">
                    {
                        members.length !== 0 ? members.map((ele, idx) => (
                            <div key={idx} style={{ width: "20%", height: "auto", padding: "0 0.25rem" }}>
                                <label style={{ padding: "0 0" }}> {ele} </label>
                                <input type="number" className="expncl" placeholder={ele} name={`s-${idx}`} onChange={onMoneyInput} defaultValue={spenders[idx]} />
                            </div>
                        )) : (<div> </div>)
                    }
                </div>

                {members.length !== 0 && (
                    <div>
                        <label>Tick All</label>
                        <input type="checkbox" onChange={onTickAll} />
                    </div>)}
                {
                    members.length !== 0 ? members.map((elem, indx) => (
                        <span key={indx}>
                            <label> {elem} </label>
                            <input type="checkbox" name={`c-${indx}`} onChange={tickEditMembers} checked={consumers[indx] || tickAll} />
                        </span>
                    )) : <span></span>
                }
                <br /> <br />
                <input type="button" value="Back" onClick={() => navigate("/dashboard")} />
                {members.length !== 0 && <input type="button" onClick={submitTripExpense} value="Confirm Edit" />}

            </form>
        </>
    )
}

export default EditTripData;
