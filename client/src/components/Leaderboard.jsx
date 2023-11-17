import { useState, useEffect, useContext } from 'react'
import GameContext from '../context/GameContext'
import axios from 'axios';

const Leaderboard = () => {

    const { currentGameType } = useContext(GameContext);
    const { api } = useContext(GameContext);
    const [ leaderboardData, setLeaderboardData] = useState([]);

    useEffect(() => {
        axios.get(`${api}/allscores?size=${currentGameType}`).then((response) => {
            // console.log(response.data)
            setLeaderboardData(response.data);
        }).catch((error) => {
            console.log(error.response.data)
        })
    }, [])

    return (
        <>
            <h2 style={{marginBottom:7}}><b>{currentGameType}</b> Leaderboard</h2>
            <div className="table-container">
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
            </div>
        </>
    )
}

export default Leaderboard