import React, {useCallback, useEffect, useMemo, useState} from 'react';
import './App.css';
import {computer, defaultField, Field, human, isFullField, isWin, Point, getTicTacToeBestStep} from "./algoritm/ticTacToeMinimax";
import cx from "classnames"

function App() {
  const [currentTree, setCurrentTree] = useState(defaultField)
  const [humanSign, setHumanSign] = useState("O")

  const isHumanWon = useMemo(() => isWin(currentTree, human), [currentTree])
  const isComputerWon = useMemo(() => isWin(currentTree, computer), [currentTree])
  const isTie = useMemo(() => isFullField(currentTree) && !isHumanWon && !isComputerWon, [currentTree, isHumanWon, isComputerWon])

  const addHumanPoint = useCallback((hPoint: Point) => () => {
    if (hPoint === human || hPoint === computer || isHumanWon || isComputerWon) {
      return
    }

    const newTreeWithHPoint: Field = [...currentTree]
    newTreeWithHPoint[hPoint] = human

    if (isFullField(newTreeWithHPoint)) {
      setCurrentTree(newTreeWithHPoint)
      return
    }

    const { bestPosition } = getTicTacToeBestStep(newTreeWithHPoint)
    const newTreeWithCPoint: Field = [...newTreeWithHPoint]
    newTreeWithCPoint[bestPosition[0]] = computer

    setCurrentTree(newTreeWithCPoint)
  }, [currentTree, isHumanWon, isComputerWon])

  const restart = useCallback(() => {
    if (humanSign === "O") {
      const { bestPosition } = getTicTacToeBestStep(defaultField)
      const newField: Field = [...defaultField]
      newField[bestPosition[0]] = computer
      setCurrentTree(newField)
    } else {
      setCurrentTree(defaultField)
    }
  }, [humanSign])

  useEffect(() => {
    restart()
  }, [humanSign])

  return (
    <div className="App">
      <header className="App-header">
        <div className="signBlock">
          <span className="signText">Play as</span>
          <button className={cx("signButton", { "selected": humanSign === "X" })} onClick={() => setHumanSign("X")}>X</button>
          <button className={cx("signButton", { "selected": humanSign === "O" })} onClick={() => setHumanSign("O")}>O</button>
        </div>
        <div className="grid" >
          {
            currentTree.map((point, i) => {
              return <div className={cx("cell", { "empty": point !== computer && point !== human && !isHumanWon && !isComputerWon })} key={i} onClick={addHumanPoint(point)}>
                {
                  point === "c" ? <span className="point computer">{humanSign === "X" ? "O" : "X"}</span> :
                    point === "h" ? <span className="point">{humanSign}</span>
                    : ""}
              </div>
            })
          }
        </div>
        <div className={cx("result", { "visible": isHumanWon || isComputerWon || isTie })}>
          {
            isTie ? "Tie!" :
              isHumanWon ? "Impossible!"
              : "Computer won!"
          }
        </div>
      </header>
      <button className="restart" onClick={restart}>⟳</button>
    </div>
  );
}

export default App;
