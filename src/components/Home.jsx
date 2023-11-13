import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () =>{
    const navigate = useNavigate();

    return(
        <>
      
        <div>
          <button onClick={()=>{navigate('/easy')}}>Beginner</button>
          <button onClick={()=>{navigate('/intermediate')}}>Intermediate</button>
          <button onClick={()=>{navigate('/expert')}}>Expert</button>
        </div>
        <div style={{marginTop:10}}>vitesweeper by <a href="https://github.com/canavan-a">canavan-a</a></div>
        </>
    )
}

export default Home;