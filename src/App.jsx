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

  const [x, setX] = useState(null);
  const [y, setY] = useState(null);
  const [bombs, setBombs] = useState(null);

  const [size, setSize] = useState(null);

  useEffect(()=>{
    if(size != null){
      if(size === 'small'){
        setX(9);
        setY(9);
        setBombs(10);
      }
      else if(size === 'medium'){
        setX(16);
        setY(16);
        setBombs(40);
      }
      else if(size === 'large'){
        setX(30);
        setY(16);
        setBombs(99);
      }
      else{
        console.error('error');
      }
    }
  },[size])


  

  return (
    <>

    {size === null && x === null?(
      <>
      
      <div>
        <button onClick={()=>{setSize('small')}}>Beginner</button>
        <button onClick={()=>{setSize('medium')}}>Intermediate</button>
        <button onClick={()=>{setSize('large')}}>Expert</button>
      </div>
      <div style={{marginTop:10}}>vitesweeper by <a href="https://github.com/canavan-a">canavan-a</a></div>
      </>
    ):(
      <>
        <MineSweeper x={x} y={y} bombs={bombs} />
      </>
      )}
      
    </>
  )
}

export default App
