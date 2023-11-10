import { useState, useEffect } from 'react'

const Cell = (props) => {
    const { x } = props;
    const { y } = props;
    const { xSize } = props;
    const { ySize } = props;
    const { id } = props;
    const { bombList } = props;
    const { secret } = props;
    const { openedList, setOpenedList } = props;
    const { board } = props;
    const { convertValues } = props;
    const { pullCoord } = props;
    const { restartSignal, setRestartSignal } = props;
    const { turnNumber, setTurnNumber } = props;
    const { flagList, setFlagList } = props;
    const { entryPoint, setEntryPoint } = props;
    const { gameState, setGameState } = props;
    const { triggerOpenList, setTriggerOpenList } = props;

    const {setTimerState} = props;

    const [isHover, setIsHover] = useState(false);

    const [killValue, setKillValue] = useState(null);

    useEffect(() => {

        setKillValue(null);

    }, [restartSignal]);

    useEffect(() => {
        if (triggerOpenList.length > 0) {
            if (triggerOpenList[id] && !openedList[id]) {
                let temp = [...triggerOpenList]
                temp[id] = false;
                setTriggerOpenList(temp);
                openCell()
            }
        }
    }, [triggerOpenList])

    useEffect(() => {
        if (entryPoint === id && board.length !== 0) {
            console.log(`retry: ${id}`);
            openCell();
        }
    }, [board]);

    const openCell = async () => {
        if (flagList.includes(id)) { return }
        if (secret !== 0 && turnNumber === 0) {
            console.log('not zero retrying')
            setEntryPoint(id);
            setRestartSignal(restartSignal + 1);
            
            return
        }
        setTimerState('started');
        setEntryPoint(null);
        setTurnNumber(turnNumber + 1);
        const temp = [...openedList]
        temp[id] = true;
        setOpenedList(temp);
        if (secret === 0) {

            let start = await getTouchingZeros(x, y, [[x, y]])

            while (true) {
                let copy = [...start]

                for (const value in start) {
                    copy = await getTouchingZeros(start[value][0], start[value][1], copy)
                }
                if (start.length !== copy.length) {
                    start = [...copy]
                }
                else {
                    // setHoldState([...copy]);

                    let temp = [...openedList]
                    copy.forEach((element) => {

                        temp[convertValues(element[0], element[1])] = true

                    });


                    //begin extra layer
                    for (const value in start) {
                        copy = await addExtraLayer(start[value][0], start[value][1], copy)
                    }
                    let t = [...openedList]
                    copy.forEach((element) => {
                        if (!element.includes(-1) && !(element[0] === xSize) && !(element[1] === ySize)) {
                            t[convertValues(element[0], element[1])] = true
                        }


                    });
                    t[id] = true;

                    setOpenedList(t);
                    break;
                }
            }

            // let copy = [...holdState]


            // setOpenedList(temp);


        }

    }




    async function getTouchingZeros(x, y, previousCoords) {
        let output = [...previousCoords]

        try {
            if (board[y][x + 1] === 0 && !containsPair(output, [x + 1, y])) {
                output.push([x + 1, y]);
            }
        } catch { }

        try {
            if (board[y][x - 1] === 0 && !containsPair(output, [x - 1, y])) {
                output.push([x - 1, y]);
            }
        } catch { }

        try {
            if (board[y + 1][x] === 0 && !containsPair(output, [x, y + 1])) {
                output.push([x, y + 1]);
            }
        } catch { }

        try {
            if (board[y - 1][x] === 0 && !containsPair(output, [x, y - 1])) {
                output.push([x, y - 1]);
            }
        } catch { }

        try {
            if (board[y + 1][x + 1] === 0 && !containsPair(output, [x + 1, y + 1])) {
                output.push([x + 1, y + 1]);
            }
        } catch { }

        try {
            if (board[y - 1][x - 1] === 0 && !containsPair(output, [x - 1, y - 1])) {
                output.push([x - 1, y - 1]);
            }
        } catch { }

        try {
            if (board[y - 1][x + 1] === 0 && !containsPair(output, [x + 1, y - 1])) {
                output.push([x + 1, y - 1]);
            }
        } catch { }
        try {
            if (board[y + 1][x - 1] === 0 && !containsPair(output, [x - 1, y + 1])) {
                output.push([x - 1, y + 1]);
            }
        } catch { }
        return output
    }

    async function addExtraLayer(x, y, previousCoords) {
        let output = [...previousCoords]
        try {
            if (!containsPair(output, [x + 1, y])) {
                board[y][x + 1] !== 'b'
                output.push([x + 1, y])



            }
        } catch { }

        try {
            if (!containsPair(output, [x - 1, y])) {
                board[y][x - 1] !== 'b'
                output.push([x - 1, y])

            }
        } catch { }

        try {
            if (!containsPair(output, [x, y + 1])) {
                board[y + 1][x] !== 'b'
                output.push([x, y + 1])

            }
        } catch { }

        try {
            if (!containsPair(output, [x, y - 1])) {
                board[y - 1][x] !== 'b'
                output.push([x, y - 1])

            }
        } catch { }

        try {
            if (!containsPair(output, [x + 1, y + 1])) {
                board[y + 1][x + 1] !== 'b'
                output.push([x + 1, y + 1])

            }
        } catch { }

        try {
            if (!containsPair(output, [x - 1, y - 1])) {
                board[y - 1][x - 1] !== 'b'
                output.push([x - 1, y - 1])

            }
        } catch { }

        try {
            if (!containsPair(output, [x + 1, y - 1])) {
                board[y - 1][x + 1] !== 'b'
                output.push([x + 1, y - 1])

            }
        } catch { }

        try {
            if (!containsPair(output, [x - 1, y + 1])) {
                board[y + 1][x - 1] !== 'b'
                output.push([x - 1, y + 1])

            }
        } catch { }

        return output
    }


    function containsPair(listOfPairs, toCheck) {
        let found = false;
        for (const sublist of listOfPairs) {
            if (JSON.stringify(toCheck) === JSON.stringify(sublist)) {
                found = true;
            }
        }
        return found;

    }


    const handleRightClick = async (e) => {
        e.preventDefault();
        if (flagList.includes(id)) {
            const temp = [...flagList]
            const x = temp.filter(item => item !== id)
            setFlagList(x);
        }
        else {
            const temp = [...flagList]
            temp.push(id)
            setFlagList(temp);
        }

    }

    // condition for losing
    useEffect(() => {
        if (openedList[id] && bombList.includes(id) && entryPoint == null) {
            setKillValue(id);
            setTimerState('stopped');
            setGameState('lost');
            console.log('L');
        }
    }, [openedList]);



    const clearSurrounding = async (e) => {


        if (e.button === 1) {
            //count flags surrounding clicked must be === to number
            //If this checks then
            // console.log('middle')
            console.log('middle click')
            const aroundCoordinates = await addExtraLayer(x, y, []);
            const validatedCoordinates = []
            let counter = 0;
            for (const m in aroundCoordinates) {
                if (validCoordinate(aroundCoordinates[m])) {
                    if (flagList.includes(convertValues(aroundCoordinates[m][0], aroundCoordinates[m][1]))) { counter++; }
                    validatedCoordinates.push(convertValues(aroundCoordinates[m][0], aroundCoordinates[m][1]))
                }
            }
            console.log()
            console.log(counter)
            if (board[y][x] == counter) {
                setTriggerOpenList((prevList) => {
                    const updatedList = [...prevList];
                    for (const element in validatedCoordinates) {
                        if (validatedCoordinates[element] >= 0 && validatedCoordinates[element] < (xSize * ySize)) {
                            updatedList[validatedCoordinates[element]] = true;
                        }

                    }
                    return updatedList;
                });
            }

        }
    }

    const validCoordinate = (coord) => {
        if (coord[0] < 0 || coord[0] === xSize) {
            return false
        }
        else if (coord[1] < 0 || coord[1] === ySize) {
            return false
        }
        else {
            return true
        }
    }


    return (
        <>
            {gameState === 'pending' ? (
                <>
                    {openedList[id] ? (
                        <div onMouseDown={clearSurrounding} style={{ width: 25, height: 25, borderColor: 'fff', borderWidth: 1, margin: 'auto', userSelect: 'none' }}>
                            {bombList.includes(id) ? '💣' :
                                <>{secret === 0 ? '' : secret}</>
                            }
                        </div>
                    ) : (
                        <div
                            className='cell'
                            onClick={openCell}
                            onContextMenu={handleRightClick}
                            // onMouseEnter={handleMouseEnter}
                            // onMouseLeave={handleMouseLeave} 
                            style={{
                                width: 25,
                                height: 25,
                                backgroundColor: 'gray',
                                borderColor: 'fff',
                                borderWidth: 1,
                                margin: 'auto',
                                transition: 'background-color 0.1s',
                                userSelect: 'none',
                            }}>
                            {flagList.includes(id) ? '🚩' : ''}
                        </div>
                    )}
                </>) : (
                // if game is complete
                <div style={{ width: 25, height: 25, borderColor: 'fff', borderWidth: 1, margin: 'auto', userSelect: 'none' }}>
                    {bombList.includes(id) ? id === killValue ? '💥' : '💣' :
                        <>{secret === 0 ? '' : secret}</>
                    }
                </div>
            )}
        </>
    );
}

export default Cell;