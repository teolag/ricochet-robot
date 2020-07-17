import { Level } from "../src/models/Level"
import { Solver } from "../src/models/Solver"
import { expect } from "chai"
import { level_5x3, level_impossible_3x3 } from "./test-levels"
import { Direction } from "../src/enums/Direction"

describe("solve", () => {
  it("level_5x3", () => {
    const level = new Level(level_5x3)
    const solver = new Solver(level)
    const result = solver.solve()
    expect(result.isRouteFound).to.be.true
    expect(result.route).to.be.an('array').of.length(2)
    expect(result.statesChecked).to.be.equal(2)
    expect(result.robotsUsed).to.eql([0])
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

describe("Performance", () => {
  it("Solve a 10 steps level in about 1.5s", function () {
    this.timeout(20000)
    const level = new Level({height: 10, width: 10, wallsCount: 20, robotCount: 4, seed: 422367})
    const solver = new Solver(level)
    const baseMem = process.memoryUsage().heapUsed
    /*
    solver.onProgress((data => {
      console.log("Progress", data)
      const heapUsed = process.memoryUsage().heapUsed-baseMem;
      console.log(`The script uses approximately ${Math.round(heapUsed/1024/1024)} MB`, heapUsed/data.checkedStates, 'bytes per state');
    }), 10000)
    */
    const result = solver.solve()
    // console.log("Solver result", result)
    const heapUsed = process.memoryUsage().heapUsed-baseMem;
    // console.log(`The script uses approximately ${Math.round(heapUsed/1024/1024)} MB`, heapUsed/result.statesChecked, 'bytes per state');
    expect(result.isRouteFound).to.be.true
    expect(result.statesChecked).to.equal(122231)
    expect(result.robotsUsed).to.eql([0, 2, 3])
    expect(result.duration).to.be.a('number').gt(1).lt(1.6)
    expect(result.route.length).to.equal(10)
    expect(result.route).to.eql([
      {robotIdx: 0, direction: Direction.LEFT},
      {robotIdx: 0, direction: Direction.DOWN},
      {robotIdx: 3, direction: Direction.LEFT},
      {robotIdx: 3, direction: Direction.DOWN},
      {robotIdx: 3, direction: Direction.RIGHT},
      {robotIdx: 0, direction: Direction.UP},
      {robotIdx: 2, direction: Direction.DOWN},
      {robotIdx: 3, direction: Direction.LEFT},
      {robotIdx: 0, direction: Direction.DOWN},
      {robotIdx: 0, direction: Direction.RIGHT}
    ])
  })

  it.skip("Try to solve a too difficult there-and-back-again level", function (done) {
    this.timeout(200000)
    const level = new Level({height: 10, width: 10, wallsCount: 20, robotCount: 4, seed: 661950})
    let solver = new Solver(level, {abortAfter: 10000000, backAgain: true})
    const baseMem = process.memoryUsage().heapUsed
    solver.onProgress((data => {
      console.log("Progress", data)
      const heapUsed = process.memoryUsage().heapUsed-baseMem;
      console.log(`The script uses approximately ${Math.round(heapUsed/1024/1024)} MB`, heapUsed/data.checkedStates, 'bytes per state');
    }), 10000)
    const result = solver.solve()

    setInterval(() => {
      const heapUsed = process.memoryUsage().heapUsed;
      console.log(`The script uses approximately ${Math.round(heapUsed/1024/1024)} MB`);
    }, 1000)
    solver = undefined
    setTimeout(() => {
      done()
    }, 30000)
    console.log("Solver result", result)
  })
})


describe("View checked states", () => {
  it.skip('Solve with 17 states, 3 moves', () => {
    // http://localhost:8080/?width=4&height=4&seed=1&robotCount=3&wallsCount=3&backAgain=false
    const level = new Level({width:4, height:4, seed:1, robotCount:3, wallsCount:3})
    const solver = new Solver(level)
    const result = solver.solve()
    expect(result.isRouteFound).to.be.true
    expect(result.statesChecked).to.equal(17)
    expect(result.route.length).to.equal(3)
    /*
    printBoard('0 - ' + result.route[0].previous+'.png', level.board, level.goal)
    result.route.forEach((state, i) => {
      console.log(state)
      const file = i+1 + ' - ' + state.hash+'.png'
      printBoard(file, level.board, level.goal, state)
    })
    */
  })

  it.skip('4 drag 108 states...  är det rimligt??', () => {
    // http://localhost:8080/?width=4&height=4&seed=5&robotCount=3&wallsCount=3&backAgain=false
  })
})