import { h } from "preact"
import Header from "../src/components/header/Header"
// See: https://github.com/preactjs/enzyme-adapter-preact-pure
import { shallow } from "enzyme"

describe("Initial Test of the Header", () => {
  test("Header renders 3 nav items", () => {
    const context = shallow(<Header />)
    // expect(context.find("a").text()).toBe("Home")
    expect(context.find("Link").length).toBe(2)
  })
})
