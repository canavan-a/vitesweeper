import { useState } from 'react'

const Cell = (props) => {
    const { x } = props;
    const { y } = props;
    const { id } =  props;
    const { bombList } = props;

    const [open, setOpen] = useState(false);

    const openCell = () =>{
        console.log(`${x} and ${y}`);
        setOpen(true);
    } 

    return (
        <>  
            {open?(
            <div  style={{ width: 25, height: 25, backgroundColor: 'aaa', borderColor: 'fff', borderWidth: 1, margin: 'auto' }}>
                {bombList.includes(id) ? '💣':''}
            </div>
            ):(
                <div onClick={openCell} style={{ width: 25, height: 25, backgroundColor: 'ggg', borderColor: 'fff', borderWidth: 1, margin: 'auto' }}>
                {id}
            </div>
            )}
        </>
    );
}

export default Cell;