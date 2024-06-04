// players
export const computer = "c";
export const human = "h";

// board types
export type Point = number | typeof computer | typeof human
export type Field = [Point,Point,Point,Point,Point,Point,Point,Point,Point]

// board
export const defaultField: Field = [
  0,1,2,
  3,4,5,
  6,7,8
];

// check if player won
export const isWin = (field: Field, player: typeof computer | typeof human): boolean => {
  const getPoints = (indexes: number[]) => indexes.map(index => field[index])
  const check = (point: Point) => point === player
  // vertical win
  const topWin = getPoints([0,1,2]).every(check);
  const middleWin = getPoints([3,4,5]).every(check);
  const bottomWin = getPoints([6,7,8]).every(check);
  // horizontal win
  const leftWin = getPoints([0,3,6]).every(check);
  const centerWin = getPoints([1,4,7]).every(check);
  const rightWin = getPoints([2,5,8]).every(check);
  // diagonal win
  const leftDiagonalWin = getPoints([0,4,8]).every(check);
  const rightDiagonalWin = getPoints([2,4,6]).every(check);

  return topWin || middleWin || bottomWin || leftWin || centerWin || rightWin || leftDiagonalWin || rightDiagonalWin
}

// check if board is full
export const isFullField = (field: Field) => {
  return field.every(point => point === computer || point === human)
}

// Minimax recursive algorithm to calculate value of a step
const calculateValue = (position: number, field: Field, player: typeof human | typeof computer, deep: number): number => {
  const expectedField: Field = [ ...field ]
  expectedField[position] = player

  if (isWin(expectedField, computer)) {
    return 10 - deep;
  }

  if (isWin(expectedField, human)) {
    return deep - 10;
  }

  if (isFullField(expectedField)) {
    return 0
  }

  const nextPlayer = player ===  human ? computer : human
  const nextStep = calculatePositionValues(expectedField, nextPlayer, deep + 1)
  const entries = Object.values(nextStep)

  if (human) {
    return Math.min(...entries)
  } else {
    return Math.max(...entries)
  }
}

// check every possible steps
const calculatePositionValues = (field: Field, player: typeof human | typeof computer, deep = 0): Record<number, number> => {
  return field.reduce((result: Record<number, number>, point, position) => {
    if (point === computer || point === human) {
      return result
    }
    return { ...result, [point ]: calculateValue(position, field, player, deep) }
  }, {})
}

// choose step with higher scope
const choseBestPosition = (bestPositions: Record<number, number>): [number, number] => {
  const entries = Object.entries(bestPositions)

  return entries.reduce(([resPosition, resValue], [position, value]) => {
    if (value > resValue) {
      return [Number(position), value]
    }
    return [resPosition, resValue]
  }, [0, -Infinity])
}

// get next step
export const getTicTacToeBestStep = (field: Field) => {
  const bestPositions = calculatePositionValues(field, computer)
  const bestPosition = choseBestPosition(bestPositions)
  return { field, bestPosition }
}
