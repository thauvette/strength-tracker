export const routes = {
  logs: "/",
  backups: "/backups",
  wendlerBase: "/wendler",
  wendlerCycles: "/wendler/cycles",
  wendlerCycle: "/wendler/:id",
  wendlerNew: "/wendler/new",
  wendlerNewPreview: "/wendler/new/preview",
  wendlerNewFinal: "/wendler/new/final",
  wendlerDay: "/wendler/:id/:week/:mainLift",
  exercise: "/exercise/:id/:remaining_path*",
  exerciseBase: "/exercise",
  newWorkout: "/workout",
  settings: "/settings",
  bioMetrics: "/bio",
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
    href: routes.settings,
    title: "Settings",
  },
  {
    href: routes.bioMetrics,
    title: "Bio Metrics",
  },
]
