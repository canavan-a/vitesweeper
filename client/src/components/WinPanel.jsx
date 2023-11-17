import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const WinPanel = (props) =>{

    const {time} = props;
    const [value, setValue] = useState("");

    const updateValue =(e)=>{
        setValue(e.target.value);
    }

    const sendScore = () =>{
        
        if(value.length > 1){
            console.log('hello')
            console.log(time);
        }
    }

    return(
        <div style={{margin:5}}>
            <input style={{height:30, width:100, borderRadius:5, margin:5 }} value={value} onChange={updateValue} placeholder=" name"></input>
            <button disabled="" onClick={sendScore} >submit</button>
        </div>
    )
}

export default WinPanel;