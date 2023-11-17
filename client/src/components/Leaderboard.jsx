import { useState, useEffect, useContext } from 'react'
import GameContext from '../context/GameContext'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Leaderboard = () => {
    const navigate = useNavigate()
    const { currentGameType, setCurrentGameType } = useContext(GameContext);
    const { api } = useContext(GameContext);
    const [ leaderboardData, setLeaderboardData] = useState([]);
    const queryParams = new URLSearchParams(location.search);
    const [msg, setMsg] = useState(queryParams.get('s'));
    
    async function gameType(){
        let gtype = "a"
        if (msg === "small" ){
            gtype = "small"
            setCurrentGameType("small")
        }
        else if(msg === "medium"){
            gtype = "medium"
            setCurrentGameType("medium")
        }
        else if(msg === "large"){
            gtype = "large"
            setCurrentGameType("large")
        }
        else{
            gtype = currentGameType
            console.log("boring")
        }

        axios.get(`${api}/allscores?size=${gtype}`).then((response) => {
            // console.log(response.data)
            setLeaderboardData(response.data);
        }).catch((error) => {
            console.log(error.response.data)
        })

    }
    

    useEffect(() => {
        gameType()
    }, [])

    return (
        <>
            <h2 style={{marginBottom:7}}><b>{currentGameType}</b> Leaderboard</h2>
            <div className="table-container">
            {leaderboardData.length ===0?(
                <div>No records to display</div>
            ):(
            <table>
                
                <tbody>
                    {leaderboardData.map((value, index)=>(
                        <tr key={value.id}>
                            <td>{index+1}</td>
                            <td>{value.username}</td>
                            <td>{value.score}s</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}
            </div>
            <button style={{marginTop:10}} onClick={()=>{navigate("/")}}>menu</button>
        </>
    )
}

export default Leaderboard