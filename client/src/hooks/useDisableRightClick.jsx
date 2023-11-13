import { useState, useEffect } from 'react';

const useDisableRightClick = () =>{
    const handleContextMenu = (e) => {
        e.preventDefault();
      };
    
      useEffect(() => {
        window.addEventListener('contextmenu', handleContextMenu);
    
        return () => {
          window.removeEventListener('contextmenu', handleContextMenu);
        };
      }, []);

}

export default useDisableRightClick