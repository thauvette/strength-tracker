# workout app and wendler cycle generator

This is just a little personal project I started to try making a PWA using indexedDB. It is a work in progress.

Muscle Group Refactor TODO:

<!-- prettier-ignore -->
- get muscle groups (exercise search etc) now needs label + id
- restore from backup needs to check for muscle groups (if not a number try to match or create new.)
  - could maybe return an array of "conflicts"
-

TODO: change app name and logo, and favicon

<!-- prettier-ignore -->
TODO: Edit exercises
    - add exercise types
        - body weight,
        - body weight + weight (auto add last body weight in bio metrics)
        - time
        - time + weight
    - allow multiple secondary muscle groups.
    - add descriptions

TODO: wendler first set last vs BBB and SLBBB

TODO: home screen menu?? (maybe as a fixed footer)

TODO: notes for day. (maybe by workout too, allowing for multiple workouts)

TODO: stats view.

TODO: back up settings (move to indexedDb as well)

TODO: styles not loading when offline - probably also want to remove code splitting

TODO: Screen always on? (currently only in chrome 84)

TODO: Swipe on calendar view??

TODO: clean up all naming conventions.

TODO: more stats on exercise view (Charts)

TODO: non-wendler routines

TODO: clean up useDB, that got out of hand 😬

TODO: wendler form errors

TODO: Super sets

TODO: connect to watch?

TODO: custom plate calculator settings per exercise (example on RDL I only want 25s and under)

## CLI Commands

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# test the production build locally
npm run serve

# run tests with jest and enzyme
npm run test
```

For detailed explanation on how things work, checkout the [CLI Readme](https://github.com/developit/preact-cli/blob/master/README.md).
