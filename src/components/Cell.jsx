import { useState } from 'react'

const Cell = (props) => {
    const { x } = props;
    const { y } = props;
    const { id } =  props;
    const { bombList } = props;
    const { secret } = props;
    const { openedList, setOpenedList } = props;
    const {board} = props; 
    const {convertValues} = props;
    const {pullCoord} = props;
    const {restartSignal ,setRestartSignal} = props;
    const {turnNumber, setTurnNumber} = props;
    const {flagList, setFlagList} = props;

    const openCell = async () =>{
        if(flagList.includes(id)){return}
        if(secret !== 0 && turnNumber === 0){
            console.log('not zero retrying')
            setRestartSignal(restartSignal+1);
            return
        }
        
        setTurnNumber(turnNumber+1);
        const temp = [...openedList]
        temp[id] = true;
        setOpenedList(temp);
        if(secret === 0){

            let start = await getTouchingZeros(x,y,[[x,y]])

            while(true){
                let copy = [...start]
                
                for (const value in start){
                    copy = await getTouchingZeros(start[value][0], start[value][1], copy)
                }
                if (start.length !== copy.length){
                    start = [...copy]
                }
                else{
                    console.log(copy.length);
                    
                    let temp = [...openedList]
                    copy.forEach((element)=>{
                        
                        temp[convertValues(element[0],element[1])] = true
                        
                    });
                    setOpenedList(temp);
                    break;
                }
            }
            
        }
        
    }

    async function getTouchingZeros(x,y,previousCoords){
        let output = [...previousCoords]

        try{
            if( board[y][x+1] === 0 && !containsPair(output, [x+1,y])){
                output.push([x+1,y]);
            }
        }catch{}

        try{
            if( board[y][x-1] === 0 && !containsPair(output, [x-1,y])){
                output.push([x-1,y]);
            }
        }catch{}

        try{
            if( board[y+1][x] === 0 && !containsPair(output, [x,y+1])){
                output.push([x,y+1]);
            }
        }catch{}

        try{
            if( board[y-1][x] === 0 && !containsPair(output, [x,y-1])){
                output.push([x,y-1]);
            }
        }catch{}

        try{
            if( board[y+1][x+1] === 0 && !containsPair(output, [x+1,y+1])){
                output.push([x+1,y+1]);
            }
        }catch{}

        try{
            if( board[y-1][x-1] === 0 && !containsPair(output, [x-1,y-1])){
                output.push([x-1,y-1]);
            }
        }catch{}

        try{
            if( board[y-1][x+1] === 0 && !containsPair(output, [x+1,y-1])){
                output.push([x+1,y-1]);
            }
        }catch{}
        try{
            if( board[y+1][x-1] === 0 && !containsPair(output, [x-1,y+1])){
                output.push([x-1,y+1]);
            }
        }catch{}
        return output
    }

    async function addExtraLayer(x,y,previousCoords){
        let output = [...previousCoords]

        try{
            if( !containsPair(output, [x+1,y])){
                output.push([x+1,y]);
                
            }
        }catch{}

        try{
            if( !containsPair(output, [x-1,y])){
                output.push([x-1,y]);
            }
        }catch{}

        try{
            if( !containsPair(output, [x,y+1])){
                output.push([x,y+1]);
            }
        }catch{}

        try{
            if( !containsPair(output, [x,y-1])){
                output.push([x,y-1]);
            }
        }catch{}

        try{
            if( !containsPair(output, [x+1,y+1])){
                output.push([x+1,y+1]);
            }
        }catch{}

        try{
            if( !containsPair(output, [x-1,y-1])){
                output.push([x-1,y-1]);
            }
        }catch{}

        try{
            if( !containsPair(output, [x+1,y-1])){
                output.push([x+1,y-1]);
            }
        }catch{}

        try{
            if( !containsPair(output, [x-1,y+1])){
                output.push([x-1,y+1]);
            }
        }catch{}

        return output
    }


    function containsPair(listOfPairs, toCheck){
        let found = false;
        for (const sublist of listOfPairs) {
            if (JSON.stringify(toCheck) === JSON.stringify(sublist)) {
                found = true;
            }
        }
        return found;
        
    }


    const handleRightClick = (e) => {
        e.preventDefault();
        if(flagList.includes(id)){
            const temp = [...flagList]
            const x = temp.filter(item => item !== id)
            setFlagList(x);
        }
        else{
            const temp = [...flagList]
            temp.push(id)
            setFlagList(temp);
        }
        
    }
    


    return (
        <>  
            {openedList[id]?(
            <div  style={{ width: 25, height: 25, borderColor: 'fff', borderWidth: 1, margin: 'auto' }}>
                {bombList.includes(id) ? '💣':secret}
            </div>
            ):(
            <div onClick={openCell} onContextMenu={handleRightClick} style={{ width: 25, height: 25, backgroundColor: 'gray', borderColor: 'fff', borderWidth: 1, margin: 'auto' }}>
                {flagList.includes(id)?'F':''}
            </div>
            )}
        </>
    );
}

export default Cell;