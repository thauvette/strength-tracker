import { h } from "preact"
import { Router } from "preact-router"

import Header from "./header/Header"
// Code-splitting is automated for `routes` directory
import NewSchedule from "../routes/newSchedule/newSchedule"
import Home from "../routes/home/Home"
import Workout from "../routes/workout/Workout"
import useDB, { DBProvider } from "../context/db"

import style from "./app.scss"

const DBWrapper = () => {
  const { isInitialized } = useDB()
  return (
    <div id="app">
      <Header />
      {isInitialized ? (
        <div class={style.content}>
          <Router>
            <Home path="/" />
            <NewSchedule path="/new-wendler" />
            <Workout path="/workout/:id" />
          </Router>
        </div>
      ) : (
        <p>Loading</p>
      )}
    </div>
  )
}

const App = () => (
  <DBProvider>
    <DBWrapper />
  </DBProvider>
)

export default App
