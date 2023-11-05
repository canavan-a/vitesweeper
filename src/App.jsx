import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Cell from './components/cell'
function App() {
  const [gameState, setGameState] = useState('pending')
  const [xSize, setXSize] = useState(15);
  const [ySize, setYSize] = useState(10);
  const [totalBombs, setTotalBombs] = useState(3);
  const [bombList, setBombList] = useState([]);
  const [board, setBoard] = useState([]);
  const [openedList, setOpenedList] = useState([]);
  const [flagList, setFlagList] = useState([]);
  const [restartSignal, setRestartSignal] = useState(0);
  const [turnNumber, setTurnNumber] = useState(0); 

  const [entryPoint, setEntryPoint] = useState(null);

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
        if(temp[element]===false || temp[element] ===undefined){
          if(!bombList.includes(parseInt(element))){
            win = 'pending'
          }
        }
      }
      if (win === 'win'){
        setGameState(win);
      }
      
    }
  }

  useEffect(()=>{
    winCondition()
  },[openedList])
    


  useEffect(() => {
    async function initBoard() {
      const temp = Array.from({ length: ySize }, () => false);
      setOpenedList(temp);
      setFlagList([]);
      await generateBombList();
    }
    initBoard();
    setTurnNumber(0);
  }, [xSize, ySize, restartSignal]);

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


  return (
    <>
      {gameState === 'win'? (<h1>You Win</h1>):(<></>)}
      {gameState === 'lost'? (<h1>You Lost</h1>):(<></>)}
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
              ></Cell>
            ))}
          </div>
        ))}

              <button onClick={()=>{generateBombList();setRestartSignal(restartSignal+1);setGameState('pending');}}>Refresh</button>
              <div>🚩{bombList.length - flagList.length}</div>
      </div>
    </>
  )
}

export default App
