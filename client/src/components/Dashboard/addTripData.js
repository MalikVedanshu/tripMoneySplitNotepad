import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '../Loading';
import { useNavigate } from "react-router-dom";




function Addtripdata() {

    const navigate = useNavigate();


    const [expenseFor, setExpenseFor] = useState("");
    const [members, setMembers] = useState([])
    const [spenders, setSpenders] = useState([])
    const [consumers, setConsumers] = useState([])
    const [loading, setLoading] = useState(false)
    const [tickAll, setTickAll] = useState(false);
    let [errorVals, setErrorVals] = useState("");
    const [networkRes, setNetworkRes] = useState("");
    
 /* eslint-disable */
    useEffect(() => {
        async function allMembers() {
            try {
                const token = localStorage.getItem("token");
                let res = await axios.get("/api/trip/getmembers", { headers: { "z-auth-token": token } })
                let allMem = res.data.members
                let consumerArr = allMem.map(elem => elem = false)
                let spenderArr = allMem.map(elem=> elem = 0)
                setMembers(res.data.members);
                setSpenders(spenderArr)
                setConsumers(consumerArr)
    
                
            }
            catch (error) {
                localStorage.removeItem("token");
                navigate("/login");
            }
        }
        allMembers();
        
    },[])
   /* eslint-disable */ 

    const onTickAll = (eve) => {
        if(tickAll === false) {
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

    // const onMembersSelect = (eve) => {
    //     if(tickAll === true) {
    //         let tempArr = consumers.map(ele => true)
    //         setConsumers(tempArr)
    //     } else {
    //         let tempArr = [...consumers]
    //         let indxx = +eve.target.name.split('-')[1]
    //         tempArr[indxx] = !tempArr[indxx]
    //         setConsumers(tempArr)
    //     }
        
    // }

     const onMembersSelect = (eve) => {
        setTickAll(false);
            let tempArr = [...consumers]
            let indxx = +eve.target.name.split('-')[1]
            tempArr[indxx] = !tempArr[indxx]
            setConsumers(tempArr)
        
        
    }
    
    const submitTripExpense = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            let expenseData = { expenseFor: expenseFor, moneySpentBy: spenders, moneyConsumedBy: consumers };
            let res = await axios.post("/api/trip/addexpense", expenseData, { headers: { "z-auth-token": token } });
            setLoading(false);
            setNetworkRes(res.data.msg);
            setTimeout(() => {
                setNetworkRes("");
                // let consumerArr = members.map(elem => elem = false)
                // let spenderArr = members.map(elem=> elem = 0)
                // setSpenders(spenderArr)
                // setConsumers(consumerArr)
            },2000)
            
            
        }
        catch (error) {
            setLoading(true);
            let allErrors = error.response.data;
            typeof (allErrors.error) === "string" ? setErrorVals(allErrors.error) : setErrorVals(allErrors.error.msg);
            setTimeout(async () => {
                setErrorVals("")
            }, 3000)
            setLoading(false);
        }
    }


    return (
        <>
        {
            loading && (<Loading />)
        }
        {
            networkRes !== "" && (<h3 style={{ color: "green" }}>{networkRes} </h3>)
        }
            <h2>Add Expense</h2>
            <h3 style={{color: "rgb(150, 20, 20)", textAlign: "center"}}>{errorVals}</h3>
            <form>
                { members.length !== 0 && <input type="text" placeholder='Expense for ?' onChange={(eve) => {setExpenseFor(eve.target.value)}}/>}
                <div className="addexp">
                {
                    members.length !== 0 ? members.map((ele, idx) => (
                        <div key={idx} style={{width: "20%", height: "auto", padding: "0 0.25rem",}}>
                            <label style={{ padding: "0 0"}}> {ele} </label>
                            <input type="number" className="expncl" placeholder={ele} name={`s-${idx}` } onChange={onMoneyInput} />
                        </div>
                    )) : (<div> </div>)
                }
                </div>
                
                {members.length !== 0 && <span>
                
                <label>Tick All</label>
                <input type="checkbox" onChange={onTickAll} checked={tickAll} />
                </span>}
                {
                    members.length !== 0 ? members.map((elem, indx) => (
                        <span key={indx}>
                            <label> {elem} </label>
                            <input type="checkbox" name={`c-${indx}`} onChange={onMembersSelect} checked={consumers[indx] || tickAll} />
                        </span>
                    )) : <span></span>
                }
                <br /> <br />
                { members.length !== 0 && <input type="button" onClick={submitTripExpense} value="Submit Expense" /> }
            </form> <br />
        </>
    )
}

export default Addtripdata;
