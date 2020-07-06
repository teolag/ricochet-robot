import { Level } from "../src/models/Level"
import { Solver } from "../src/Solver"
import { expect } from "chai"
import { level_5x3, level_impossible_3x3 } from "./test-levels"

describe("solve", () => {
  it("level_5x3", () => {
    const level = new Level(level_5x3)
    const solver = new Solver(level)
    const result = solver.solve()
    expect(result.isRouteFound).to.be.true
    expect(result.route).to.be.an('array').of.length(2)
    expect(result.statesChecked).to.be.equal(2)
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
  it.skip("Solve a 11 steps level in about 2.5s", function () {
    this.timeout(20000)
    const level = new Level({height: 10, width: 10, wallsCount: 20, robotCount: 4, seed: 422367})
    const solver = new Solver(level)
    let now = new Date().getTime()
    solver.onProgress((data => {
      console.log("Progress", new Date().getTime() - now, data)
      now = new Date().getTime()
    }), 10000)
    const result = solver.solve()
    console.log("Solver result", result)
  })

  it.skip("Try to solve a too difficult there-and-back-again level", function () {
    this.timeout(200000)
    const level = new Level({height: 10, width: 10, wallsCount: 20, robotCount: 4, seed: 661950})
    const solver = new Solver(level, {abortAfter: 1000000, backAgain: true})
    let now = new Date().getTime()
    solver.onProgress((data => {
      console.log("Progress", new Date().getTime() - now, data)
      now = new Date().getTime()
    }), 30000)
    const result = solver.solve()
    console.log("Solver result", result)
  })
})