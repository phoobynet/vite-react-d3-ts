import { random, range } from 'lodash'

export interface Point {
  x: number
  y: number
}

export const generateRandomPoints = (
  xMin = 0,
  xMax = 100,
  xStep = 1,
  yMin = 0,
  yMax = 100,
): Point[] =>
  range(xMin, xMax, xStep).map((x: number) => ({
    x,
    y: random(yMin, yMax, false),
  }))
