import { useState, useEffect } from 'react'
import Board from './components/MineSweeper'
import './App.css'
import MineSweeper from './components/MineSweeper'

function App() {

  const handleContextMenu = (e) => {
    e.preventDefault(); // Prevent the default context menu from appearing
  };

  // Attach the event handler to the window object
  useEffect(() => {
    window.addEventListener('contextmenu', handleContextMenu);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return (
    <>
      <MineSweeper x={30} y={16} bombs={99} />
      
    </>
  )
}

export default App
