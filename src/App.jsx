import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Cell from './components/cell'
function App() {
  const [xSize, setXSize] = useState(15);
  const [ySize, setYSize] = useState(10);
  const [board, setBoard] = useState([]);
  useEffect(() => {
    const tempBoard = Array.from({ length: ySize }, () =>
      Array.from({ length: xSize }, () => null)
    );
    setBoard(tempBoard);
  }, [xSize, ySize]);

  return (
    <>
      <div>

        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row" style={{display:'flex',
          justifyContent: 'center'}}>
            {row.map((cell, columnIndex) => (
              <Cell key={columnIndex} x={columnIndex} y={rowIndex}></Cell>
            ))}
          </div>
        ))}


      </div>
    </>
  )
}

export default App
