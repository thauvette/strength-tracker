export const routes = {
  logs: '/',
  backups: '/backups',
  wendlerBase: '/wendler',
  wendlerCycles: '/wendler/cycles',
  wendlerCycle: '/wendler/:id',
  wendlerNew: '/wendler/new',
  wendlerNewPreview: '/wendler/new/preview',
  wendlerNewFinal: '/wendler/new/final',
  wendlerDay: '/wendler/:id/:week/:mainLift',
  exercise: '/exercise/:id/:remaining_path*',
  exerciseBase: '/exercise',
  newWorkout: '/workout',
  settings: '/settings',
  bioMetrics: '/bio/:id/:remaining_path*',
  bioCatchAll: '/bio/:remaining_path*',
  bioMetricsBase: '/bio',
  fasting: '/fasting',
  routines: '/routines/:remaining_path*',
  routinesBase: '/routines',
  routinesNew: '/routines/new',
  activeRoutine: '/routines/active',
};

export const menuItems = [
  {
    href: routes.backups,
    title: 'Back up and sync',
  },
  {
    href: routes.wendlerCycles,
    title: 'Wendler',
  },
  {
    href: routes.settings,
    title: 'Settings',
  },
  {
    href: routes.bioMetricsBase,
    title: 'Bio Metrics',
  },
  {
    href: routes.fasting,
    title: 'Fasting Timer',
  },
  {
    href: routes.routinesBase,
    title: 'Routines',
  },
];
