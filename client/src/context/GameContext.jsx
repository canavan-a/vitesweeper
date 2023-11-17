import React, { createContext, useState } from 'react';

const GameContext = createContext();

function GameContextProvider({ children }) {
    const [placeholder, setPlaceholder] = useState(null);
    const [currentGameType, setCurrentGameType] = useState("medium");
    const [api, setApi] = useState(import.meta.env.VITE_API_PATH);

    const contextValue = {
        placeholder,
        setPlaceholder,
        api,
        currentGameType,
        setCurrentGameType,
    }

    return (
        <GameContext.Provider value={contextValue}>
            {children}
        </GameContext.Provider>
    );
}

export default GameContext;


export { GameContextProvider };
