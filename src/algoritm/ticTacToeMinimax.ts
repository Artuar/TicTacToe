import {Simulate} from "react-dom/test-utils";
export import playing = Simulate.playing;

export const computer = "c";
export const human = "h";

export type Point = number | typeof computer | typeof human
export type Field = [Point,Point,Point,Point,Point,Point,Point,Point,Point]

export const defaultField: Field = [
  0,1,2,
  3,4,5,
  6,7,8
];

export const isWin = (field: Field, player: typeof computer | typeof human): boolean => {
  const check = (point: Point) => point === player
  const topWin = [field[0], field[1], field[2]].every(check);
  const middleWin = [field[3], field[4], field[5]].every(check);
  const bottomWin = [field[6], field[7], field[8]].every(check);
  const leftWin = [field[0], field[3], field[6]].every(check);
  const centerWin = [field[1], field[4], field[7]].every(check);
  const rightWin = [field[2], field[5], field[8]].every(check);
  const leftDiagonalWin = [field[0], field[4], field[8]].every(check);
  const rightDiagonalWin = [field[2], field[4], field[6]].every(check);
  return topWin || middleWin || bottomWin || leftWin || centerWin || rightWin || leftDiagonalWin || rightDiagonalWin
}

export const isFullField = (field: Field) => {
  return field.every(point => point === computer || point === human)
}

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

const calculatePositionValues = (field: Field, player: typeof human | typeof computer, deep = 0): Record<number, number> => {
  return field.reduce((result: Record<number, number>, point, position) => {
    if (point === computer || point === human) {
      return result
    }
    return { ...result, [point ]: calculateValue(position, field, player, deep) }
  }, {})
}

const choseBestPosition = (bestPositions: Record<number, number>): [number, number] => {
  const entries = Object.entries(bestPositions)

  return entries.reduce(([resPosition, resValue], [position, value]) => {
    if (value > resValue) {
      return [Number(position), value]
    }
    return [resPosition, resValue]
  }, [0, -Infinity])
}

export const getTicTacToeBestStep = (field: Field) => {
  const bestPositions = calculatePositionValues(field, computer)
  const bestPosition = choseBestPosition(bestPositions)
  return { field, bestPosition }
}

