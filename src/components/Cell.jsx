import { useState } from 'react'

const Cell = (props) => {
    const { x } = props;
    const { y } = props;
    const { id } =  props;
    const { bombList } = props;
    const { secret } = props;

    const [open, setOpen] = useState(false);

    const openCell = () =>{
        console.log(`${x} and ${y}`);
        console.log(secret);
        setOpen(true);
    } 

    return (
        <>  
            {open?(
            <div  style={{ width: 25, height: 25, borderColor: 'fff', borderWidth: 1, margin: 'auto' }}>
                {bombList.includes(id) ? '💣':''}
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