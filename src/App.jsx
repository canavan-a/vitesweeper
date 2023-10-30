import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Cell from './components/cell'
function App() {
  const [xSize, setXSize] = useState(15);
  const [ySize, setYSize] = useState(10);
  const [totalBombs, setTotalBombs] = useState(20);  
  const [bombList, setBombList] = useState([]);
  const [board, setBoard] = useState([]);
  useEffect(() => {
    const tempBoard = Array.from({ length: ySize }, () =>
      Array.from({ length: xSize }, () => null)
    );
    setBoard(tempBoard);
    generateBombList();
  }, [xSize, ySize]);

  const generateBombList = () => {
    const allValues = Array.from({ length: xSize*ySize - 1}, (_, i) => i);
    for (let i = allValues.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allValues[i], allValues[j]] = [allValues[j], allValues[i]];
    }
    setBombList(allValues.slice(0, totalBombs));
  }

  return (
    <>
      <div>

        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row" style={{display:'flex',
          justifyContent: 'center'}}>
            {row.map((cell, columnIndex) => (
              <Cell key={(rowIndex*xSize)+columnIndex} x={columnIndex} y={rowIndex} id={(rowIndex*xSize)+columnIndex}
                    bombList={bombList}></Cell>
            ))}
          </div>
        ))}


      </div>
    </>
  )
}

export default App
