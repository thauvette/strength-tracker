# workout app and wendler cycle generator

This is just a little personal project I started to try making a PWA using indexedDB. It is a work in progress.

TODO: reduce what is stored in DB and make hooks, (useQuery maybe?) to hydrate content from other stores 

TODO: review and test ALLL routines. 

<!-- prettier-ignore -->
TODO: Edit exercises
    - add exercise types
        [x] weight + reps
        [] body weight + reps,
        [x] body weight + weight (auto add last body weight in bio metrics)
        [] time
        [] time + weight

TODO: Wendler choose main exercises.

TODO: wendler first set last vs BBB and SLBBB

TODO: notes for day. (maybe by workout too, allowing for multiple workouts)

TODO: back up settings (move to indexedDb as well)

TODO: Screen always on? (currently only available chrome 84)

TODO: Swipe on calendar view??

TODO: wendler form errors

TODO: Super sets

TODO: connect to watch? - not available in brave

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
