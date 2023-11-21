import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import GameContext from '../context/GameContext';

const WinPanel = (props) =>{

    const navigate = useNavigate();
    const {currentGameType} = useContext(GameContext)
    const {api} = useContext(GameContext)
    const {time} = props;
    const [value, setValue] = useState("");
    const [disableButton, setDisableButton] = useState("");

    const updateValue =(e)=>{
        setValue(e.target.value);
    }

    const sendScore = async () =>{
        
        if(value.length > 1){
            setDisableButton("disabled")
            const payload = {
                score: time,
                username: value,
                size: currentGameType,
            }
            axios.post(`${api}/pushscore`, payload).then((response)=>{
                const scoreID = response.data.scoreID
                navigate(`/leaderboard?s=${currentGameType}&sid=${scoreID}`)
                setDisableButton("")
                console.log(response.data)
            }).catch((error)=>{
                setDisableButton("")
                console.log(error.response.data)
            })
        }
    }

    return(
        <div style={{margin:5}}>
            <input style={{height:30, width:100, borderRadius:5, margin:5 }} value={value} onChange={updateValue} placeholder=" name"></input>
            <button disabled={disableButton} onClick={sendScore} >submit</button>
        </div>
    )
}

export default WinPanel;