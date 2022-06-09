export const routes = {
  logs: "/",
  backups: "/backups",
  wendlerBase: "/wendler",
  wendlerCycles: "/wendler/cycles",
  wendlerCycle: "/wendler/:id",
  wendlerNew: "/wendler/new",
  wendlerDay: "/wendler/:id/:week/:mainLift",
  exercise: "/exercise/:id/:remaining_path*",
  exerciseBase: "/exercise",
  newWorkout: "/workout",
}

export const menuItems = [
  {
    href: routes.backups,
    title: "Back up and sync",
  },
  {
    href: routes.wendlerCycles,
    title: "Wendler",
  },
  {
    href: routes.newWorkout,
    title: "Start Workout",
  },
]
