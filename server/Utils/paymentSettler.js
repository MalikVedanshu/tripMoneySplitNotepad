function settlePayment(members,expense) {
    let payementIsNowSettled = false
    let finalArray = members.map(ele => ele = []);
    let minSpender,maxSpender;

    while(payementIsNowSettled === false) {
        
        /*
            Finding minimum and maximum indexes to be compared;
        */

        let counterIdx;
        for(let i = 0; i < expense.length; i++) {
            if(expense[i] != 0) {
                counterIdx = i;
                break;
            }
        }
        for(let i = 0; i < expense.length; i++) {
            if(expense[counterIdx] > expense[i] && expense[i] != 0) {
                counterIdx = i
            }
        }
        minSpender = counterIdx;
        maxSpender = expense.indexOf(Math.max(...expense))

        /*
            -----------------------------------------------------------------------------------------------------------------------------
        */

        /*
            converting settling values (converted negative to posite) for transfering and allocating member in next iteration;  
        */

        if (expense[maxSpender] > (expense[minSpender] * -1)) {

            finalArray[minSpender].push([members[maxSpender], (expense[minSpender] * -1)])
            expense[maxSpender] =  expense[maxSpender] + expense[minSpender];
            expense[minSpender] = 0;

        } else if (expense[maxSpender] < (expense[minSpender] * -1)) {
            
            finalArray[minSpender].push([members[maxSpender], expense[maxSpender]])
            expense[minSpender] = expense[minSpender] + expense[maxSpender];
            expense[maxSpender] = 0;

        } else if (expense[maxSpender] === (expense[minSpender] * -1)) {

            finalArray[minSpender].push([members[maxSpender], (expense[minSpender] * -1)])
            expense[maxSpender] =  0;
            expense[minSpender] = 0;
        }
        else {
            return "Something Went Wrong, Contact Admin";
        }

        /*
            terminating while-loop logic
        */

        let otherThanZero = expense.findIndex(ele => ele > 2)
        if(otherThanZero === -1){
            payementIsNowSettled = true;
            return finalArray;
        }
    }
}

// let members = ['A', 'B', 'C', 'D'];
// let expense = [6000, -4000, -3000, 1000];

export default settlePayment;