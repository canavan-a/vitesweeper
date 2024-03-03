import { useState, useEffect, useContext } from "react";
import GameContext from "../context/GameContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const Leaderboard = () => {
  const navigate = useNavigate();
  const { currentGameType, setCurrentGameType } = useContext(GameContext);
  const { api } = useContext(GameContext);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const queryParams = new URLSearchParams(location.search);
  const [msg, setMsg] = useState(queryParams.get("s"));
  const [scoreID, setScoreID] = useState(queryParams.get("sid"));

  const [scoreRankData, setScoreRankData] = useState(null);

  async function gameType() {
    let gtype = "a";
    if (msg === "small") {
      gtype = "small";
      setCurrentGameType("small");
    } else if (msg === "medium") {
      gtype = "medium";
      setCurrentGameType("medium");
    } else if (msg === "large") {
      gtype = "large";
      setCurrentGameType("large");
    } else {
      gtype = currentGameType;
      console.log("boring");
    }

    axios
      .get(`${api}/allscores?size=${gtype}`)
      .then((response) => {
        console.log(response.data);
        setLeaderboardData(response.data);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  }

  useEffect(() => {
    const payload = {
      id: Number(scoreID),
    };
    axios
      .post(`${api}/getrank`, payload)
      .then((response) => {
        console.log(response.data);
        setScoreRankData(response.data);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  }, []);

  useEffect(() => {
    gameType();
  }, []);

  return (
    <>
      <h2 style={{ marginBottom: 7 }}>
        <b>{currentGameType}</b> Leaderboard
      </h2>
      <div className="table-container">
        {leaderboardData.length === 0 ? (
          <div>No records to display</div>
        ) : (
          <>
            {" "}
            <table>
              <tbody>
                {leaderboardData.map((value, index) => (
                  <Tippy
                    key={value.id}
                    content={new Date(value.dateRecorded).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  >
                    <tr
                      style={
                        value.id === Number(scoreID)
                          ? { backgroundColor: "rgb(100, 108, 255)" }
                          : {}
                      }
                    >
                      <td>{index + 1}</td>
                      <td>
                        <b>{value.username}</b>
                      </td>
                      <td>{value.score}s</td>
                    </tr>
                  </Tippy>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
      {scoreRankData !== null && scoreRankData.rank > 50 ? (
        <table>
          <tbody>
            <tr style={{ backgroundColor: "rgb(100, 108, 255)" }}>
              <td>{scoreRankData.rank}</td>
              <td>{scoreRankData.user}</td>
              <td>{scoreRankData.score}s</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <></>
      )}
      <button
        style={{ marginTop: 10 }}
        onClick={() => {
          navigate("/");
        }}
      >
        menu
      </button>
    </>
  );
};

export default Leaderboard;
