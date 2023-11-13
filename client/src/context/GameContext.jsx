import React, { createContext, useState } from 'react';

const GameContext = createContext();

function GameContextProvider({ children }) {
    const [placeholder, setPlaceholder] = useState(null);

    const contextValue = {
        placeholder,
        setPlaceholder,
    }

    return (
        <GameContext.Provider value={contextValue}>
            {children}
        </GameContext.Provider>
    );
}

export default GameContext;


export { GameContextProvider };
