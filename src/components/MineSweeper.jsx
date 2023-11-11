import { useState, useEffect } from 'react'
import Cell from './Cell';

function MineSweeper(props) {
  const [gameState, setGameState] = useState('pending')
  const xSize = props.x;
  const ySize = props.y;
  const totalBombs = props.bombs;
  const [bombList, setBombList] = useState([]);
  const [board, setBoard] = useState([]);
  const [openedList, setOpenedList] = useState([]);
  const [flagList, setFlagList] = useState([]);
  const [restartSignal, setRestartSignal] = useState(0);
  const [turnNumber, setTurnNumber] = useState(0); 

  const [entryPoint, setEntryPoint] = useState(null);

  const [triggerOpenList, setTriggerOpenList] = useState([]);

  const [timerState, setTimerState] = useState('pending');
  const [time, setTime] = useState(0);

  useEffect(()=>{
    if(timerState === 'started'){
      const t = setTimeout(()=>{
        setTime((old)=>(old+1));
      },1000);
      return () => clearTimeout(t);
    }
  },[time, timerState]);

  const convertValues = (x,y) =>{
    return x+((y)*xSize)
  }
  const pullCoord = (item)=>{
    let y = Math.floor(item/xSize)
    let x = Math.floor(item-(y*xSize))
    return [x,y]
  }

  async function winCondition(){
    const temp = [...openedList]
    if (temp.length > 0){
      let win = 'win'
      let count = 0;
      for(const element in temp){
        if(temp[element]===false || temp[element] === undefined){
          if(!bombList.includes(parseInt(element))){
            win = 'pending'
          }
        }
      }
      if (win === 'win'){
        setTimerState('win');
        setGameState(win);
      }
      
    }
  }

  useEffect(()=>{
    winCondition()
  },[openedList])
    

  useEffect(() => {
    async function initBoard() {
      setTurnNumber(0);
      const temp = Array.from({ length: ySize*xSize - 1 }, () => false);
      
      setTriggerOpenList([...temp]);
      setOpenedList([...temp]);
      setFlagList([]);
      await generateBombList();
      //timer info
      setTimerState('pending');
      setTime(0);
      
    }
    
    initBoard();
    
  }, [restartSignal, xSize, ySize]);

  async function generateBombList() {
    const allValues = Array.from({ length: xSize * ySize - 1 }, (_, i) => i);
    for (let i = allValues.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allValues[i], allValues[j]] = [allValues[j], allValues[i]];
    }
    setBombList((bombList) => allValues.slice(0, totalBombs));
  }

  useEffect(() => {
    
    async function generateBoardContent() {
      const tempBoard = Array.from({ length: ySize }, () =>
        Array.from({ length: xSize }, () => 0)
      );
      let current = 0;
      for (let i = 0; i < ySize; i++) {
        for (let j = 0; j < xSize; j++) {
          if (bombList.includes(current)) {
            tempBoard[i][j] = 'b';
            
            try { tempBoard[i + 1][j] += 1; } catch {}
            try { tempBoard[i - 1][j] += 1; } catch {}
            
            if (j!==0){
              try { tempBoard[i][j - 1] += 1; } catch {}
              try { tempBoard[i - 1][j - 1] += 1; } catch {}
              try { tempBoard[i + 1][j - 1] += 1; } catch {}
            }

            if (j !== xSize -1){
              try { tempBoard[i][j + 1] += 1; } catch {}
              try { tempBoard[i - 1][j + 1] += 1; } catch {}
              try { tempBoard[i + 1][j + 1] += 1; } catch {}
            }
          }
          else {

          }

          current++;
        }

      }
      for (let i = 0; i < ySize; i++) {
        for (let j = 0; j < xSize; j++) {
          if (typeof tempBoard[i][j] === 'string'){
            tempBoard[i][j] = tempBoard[i][j].replace('1','');
          }
        }
      }
      setBoard(tempBoard);
    }
    if (bombList.length !== 0) {
      generateBoardContent()
    }

  }, [bombList])


  const testOpen = () =>{
    let temp = [...triggerOpenList];
    temp[5] = true;
    setTriggerOpenList(temp); 
  }

  return (
    <>
    {/* <button onClick={testOpen}>Test TOL</button> */}
    <button onClick={()=>{setRestartSignal(restartSignal+1);setGameState('pending');}}>
    {gameState === 'win'? (<>You Win</>):(<></>)}
      {gameState === 'lost'? (<>You Lost</>):(<></>)}
      {gameState === 'pending'? (<>Restart</>):(<></>)}
    </button>
    <div>{time}</div>
      
      <div>

        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row" style={{ display: 'flex', justifyContent: 'center' }}>
            {row.map((cell, columnIndex) => (
              <Cell 
              key={(rowIndex * xSize) + columnIndex} 
              x={columnIndex} 
              y={rowIndex} 
              id={(rowIndex * xSize) + columnIndex} 
              openedList={openedList}
              setOpenedList={setOpenedList}
              secret={cell}
              bombList={bombList}
              board={board}
              convertValues={convertValues}
              pullCoord={pullCoord}
              restartSignal={restartSignal}
              setRestartSignal={setRestartSignal}
              turnNumber={turnNumber}
              setTurnNumber={setTurnNumber}
              flagList={flagList}
              setFlagList={setFlagList}
              xSize={xSize}
              ySize={ySize}
              entryPoint={entryPoint}
              setEntryPoint={setEntryPoint}
              gameState={gameState}
              setGameState={setGameState}
              triggerOpenList={triggerOpenList}
              setTriggerOpenList={setTriggerOpenList}
              setTime={setTime}
              setTimerState={setTimerState}
              ></Cell>
            ))}
          </div>
        ))}

              
      </div>
      <div>🚩{bombList.length - flagList.length}</div>
    </>
  )
}

export default MineSweeper
