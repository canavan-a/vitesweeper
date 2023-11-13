import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const NotFound = () =>{
    const navigate = useNavigate() 
    return (
        <>
        <h1>404</h1>
        <button style={{marginTop:10}} onClick={()=>{navigate('/')}}>home</button>
        </>
    )
}

export default NotFound