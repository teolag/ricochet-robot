import { expect } from "chai"
import { Level } from "../src/models/Level"
import { Solver } from "../src/Solver"

const level_5x3 = '5|3111520004A888C|10|4|14'
const level_impossible_3x3 = '3|315204A8C|4|0'
const level_normal_10x10 = '10|3111111115200004a80c20000011052004200424200000800ca42000900534204a100420008520046204300004a8ca8888ce|78|94|93|13'

describe("generate a level", () => {
  const seed = 66
  const level = new Level({width: 10, height: 8, wallsCount: 20, robotCount: 3, seed})

  it("correct board size", () => {
    expect(level.board.w).to.be.equal(10)
    expect(level.board.h).to.be.equal(8)
  })
})

describe("load a level", () => {
  const level = new Level(level_5x3)

  it("correct board size", () => {
    expect(level.board.h).to.be.equal(3)
    expect(level.board.w).to.be.equal(5)
  })

  it("correct goal position", () => {
    expect(level.goal.x).to.be.equal(0)
    expect(level.goal.y).to.be.equal(2)
  })

  it("correct number of robots", () => {
    expect(level.robots).to.be.an('array').of .length(2)
  })

  it("correct robot positions", () => {
    expect(level.robots[0].x).to.be.equal(4)
    expect(level.robots[0].y).to.be.equal(0)

    expect(level.robots[1].x).to.be.equal(4)
    expect(level.robots[1].y).to.be.equal(2)
  })
  
  it("level string vs options", () => {
    const levelA = new Level({seed: 876, width:3, height:2, robotCount:2, wallsCount:6})
    const levelB = new Level("3|fbdfff|0|1|5")
    
    expect(levelA.board.getTilesString()).to.equal(levelB.board.getTilesString())
    expect(levelA.robots.length).to.equal(levelB.robots.length)
  })
})

describe("solve", () => {
  it("level_5x3", () => {
    const level = new Level(level_5x3)
    const solver = new Solver(level)
    const result = solver.solve()
    expect(result.isRouteFound).to.be.true
    expect(result.route).to.be.an('array').of.length(2)
    expect(result.statesChecked).to.be.equal(5)
  })

  it("level_impossible_3x3", () => {
    const level = new Level(level_impossible_3x3)
    const solver = new Solver(level)
    const result = solver.solve()
    expect(result.isRouteFound).to.be.false
    expect(result.isAllStatesChecked).to.be.true
    expect(result.route).to.be.undefined
    expect(result.statesChecked).to.be.equal(4)
  })
})

describe("get hints", () => {
  const level = new Level(level_normal_10x10)
  const solver = new Solver(level)
  const result = solver.solve()
  expect(result.isRouteFound).to.be.true
  expect(result.route).to.be.an('array')
  expect(result.robotsUsed).to.be.an('array').of.length(3)
  expect(result.statesChecked).to.equal(7160)
})