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

    // const [open, setOpen] = useState(false);

    const openCell = () =>{
        // console.log(`${x} and ${y}`);
        // console.log(secret);
        const temp = [...openedList]
        temp[id] = true;
        setOpenedList(temp);
        if(secret === 0){
            // console.log(convertValues(x,y))
            getTouchingZeros(x,y,[[x,y]],[convertValues(x,y)]);
        }
        
    }

    function getTouchingZeros(x,y,previous,values){
        let next = [...previous]
        let nextValues = [...values]
        try{
            let v = convertValues(x+1,y)
            if( board[x+1,y] === 0 && !nextValues.includes(v)){
                next = [...next,[x+1,y]]
                nextValues = [...nextValues,v]
                console.log('hello')
            }
        }catch{console.log('error')}
        


    }

    


    return (
        <>  
            {openedList[id]?(
            <div  style={{ width: 25, height: 25, borderColor: 'fff', borderWidth: 1, margin: 'auto' }}>
                {bombList.includes(id) ? '💣':secret}
            </div>
            ):(
                <div onClick={openCell} style={{ width: 25, height: 25, backgroundColor: 'gray', borderColor: 'fff', borderWidth: 1, margin: 'auto' }}>
                {/* {id} */}
            </div>
            )}
        </>
    );
}

export default Cell;