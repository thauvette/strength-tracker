import { h } from "preact"
import { Router } from "preact-router"

import Header from "./header/Header"
// Code-splitting is automated for `routes` directory
import NewSchedule from "../routes/newSchedule/newSchedule"
import Profile from "../routes/profile"
import Home from "../routes/home/Home"
import Workout from "../routes/workout/Workout"

import style from "./app.scss"

const App = () => (
  <div id="app">
    <Header />
    <div class={style.content}>
      <Router>
        <Home path="/" />
        <NewSchedule path="/new" />
        <Workout path="/workout/:id" />
        <Profile path="/profile/" user="me" />
        <Profile path="/profile/:user" />
      </Router>
    </div>
  </div>
)

export default App
