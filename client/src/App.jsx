import { useState, useEffect } from 'react'
import Board from './components/MineSweeper'
import './App.css'
import MineSweeper from './components/MineSweeper'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Leaderboard from './components/Leaderboard';
import {GameContextProvider}  from './context/GameContext';
import useDisableRightClick from './hooks/useDisableRightClick';
import NotFound from './components/NotFound';

function App() {

  useDisableRightClick();

  //CI CD test
  useEffect(()=>{
    console.log("CI/CD success");
  },[])

  return (
    <>
      <GameContextProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/easy" element={<MineSweeper x={9} y={9} bombs={10} gameSize={"small"}/>} />
            <Route path="/intermediate" element={<MineSweeper x={16} y={16} bombs={40} gameSize={"medium"}/>} />
            <Route path="/expert" element={<MineSweeper x={30} y={16} bombs={99} gameSize={"large"}/>} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </GameContextProvider>
    </>
  )
}

export default App
