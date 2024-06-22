import { DB_NAME, DB_VERSION, objectStores } from './config.ts';
import muscleGroups, { updatedMuscleGroups } from '../../config/muscleGroups';
import { getFromCursor as getFromCursorUtil } from './utils/dbUtils.ts';

const initializeDb = (callback) => {
  if (typeof window === 'undefined') {
    return null;
  }
  if (!window.indexedDB) {
    alert('this app does not support your browser');
  }

  // initialize DB
  const dbRequest = window.indexedDB.open(DB_NAME, DB_VERSION);
  let requiresExercises = false;
  let requiresBioMetrics = false;
  let requiresExerciseGroupRefactor = false;
  let requiresMuscleGroupUpdate = false;
  let requiresBioMetricDateUpdate = false;
  dbRequest.onsuccess = async (e) => {
    const database = e.target.result;
    const exerciseTransaction = database.transaction(
      objectStores.exercises,
      'readwrite',
    );
    if (requiresExercises) {
      exerciseTransaction
        .objectStore(objectStores.exercises)
        .add({ name: 'deadlift', primaryGroup: 1 });
      exerciseTransaction.objectStore(objectStores.exercises).add({
        name: 'barbell bench press',
        primaryGroup: 2,
      });
      exerciseTransaction
        .objectStore(objectStores.exercises)
        .add({ name: 'barbell back squat', primaryGroup: 3 });
      exerciseTransaction.objectStore(objectStores.exercises).add({
        name: 'standing overhead press',
        primaryGroup: 4,
      });
    }
    if (requiresBioMetrics) {
      const bioTransaction = database.transaction(
        objectStores.bioMetrics,
        'readwrite',
      );

      const transaction = bioTransaction.objectStore(objectStores.bioMetrics);
      transaction.add({ name: 'weight' });
    }

    if (requiresExerciseGroupRefactor) {
      const muscleGroupTransaction = database.transaction(
        objectStores.muscleGroups,
        'readwrite',
      );

      const musclesStore = muscleGroupTransaction.objectStore(
        objectStores.muscleGroups,
      );
      // need to create all our muscleGroups
      await Promise.all(
        Object.entries(muscleGroups).map(([primaryKey, subGroups]) => {
          return new Promise((resolve) => {
            // add primary key, use response to attach id to subGroups

            const request = musclesStore.add({
              name: primaryKey,
              isPrimary: 1,
              parentGroup: null,
            });

            request.onsuccess = (e) => {
              return Promise.all(
                subGroups.map(
                  (group) =>
                    new Promise((resolve) => {
                      const subRequest = musclesStore.add({
                        name: group,
                        isPrimary: 0,
                        parentGroup: e.target.result,
                      });
                      subRequest.onsuccess = (event) => {
                        resolve({
                          name: group,
                          isPrimary: 0,
                          parentGroup: e.target.result,
                          id: event.target.result,
                        });
                      };
                    }),
                ),
              ).then((subGroupResponses) => {
                // sub groups added
                resolve([
                  {
                    name: primaryKey,
                    isPrimary: 1,
                    parentGroup: null,
                    id: e.target.result,
                  },
                  ...subGroupResponses,
                ]);
              });
            };
          }).then((res) => {
            // primary group done
            return res;
          });
        }),
      ).then(async (res) => {
        // done adding muscle groups
        const addedMuscleGroups = res.flat();
        // get all exercises.
        const currentExercises = await getFromCursorUtil(
          database,
          objectStores.exercises,
        );

        const exerciseStore = database
          .transaction(objectStores.exercises, 'readwrite')
          .objectStore(objectStores.exercises);
        Object.entries(currentExercises || {}).forEach(([id, exercise]) => {
          // match primary group to newly added muscle groups
          const matchingGroup = addedMuscleGroups.find(
            (group) => group.id === exercise?.primaryGroup,
          );
          if (matchingGroup) {
            // Check if this is the primary or secondary group.
            // if secondary we also need the primary.
            const isPrimaryMatch = !!matchingGroup.isPrimary;
            const data = {
              ...exercise,
              primaryGroup: isPrimaryMatch
                ? matchingGroup.id
                : matchingGroup.parentGroup,
            };
            if (!isPrimaryMatch) {
              data.musclesWorked = [+matchingGroup.id];
            }
            exerciseStore.put(data, +id);
          } else if (exercise?.primaryGroup) {
            musclesStore.add({
              name: exercise.primaryGroup,
              isPrimary: 0,
            });
          }
        });
      });
    }

    if (requiresMuscleGroupUpdate) {
      const muscleGroupTransaction = database.transaction(
        objectStores.muscleGroups,
        'readwrite',
      );

      const musclesStore = muscleGroupTransaction.objectStore(
        objectStores.muscleGroups,
      );
      // add in new ones
      Promise.all(
        updatedMuscleGroups.map((muscle) => {
          if (muscle.id) {
            return musclesStore.put(muscle, muscle.id);
          }
          return musclesStore.add(muscle);
        }),
      ).then(async () => {
        // get all exercises and make sure primary and secondary muscles are arrays.
        const currentExercises = await getFromCursorUtil(
          database,
          objectStores.exercises,
        );

        const exerciseStore = database
          .transaction(objectStores.exercises, 'readwrite')
          .objectStore(objectStores.exercises);

        Object.entries(currentExercises || {}).forEach(([id, exercise]) => {
          const { musclesWorked, secondaryMusclesWorked } = exercise;

          const primary =
            typeof musclesWorked === 'number' ||
            typeof musclesWorked === 'string'
              ? [musclesWorked]
              : Array.isArray(musclesWorked)
              ? musclesWorked
              : [];

          const secondary =
            typeof secondaryMusclesWorked === 'number' ||
            typeof secondaryMusclesWorked === 'string'
              ? [secondaryMusclesWorked]
              : Array.isArray(secondaryMusclesWorked)
              ? secondaryMusclesWorked
              : [];

          exerciseStore.put(
            {
              ...exercise,
              musclesWorked: primary,
              secondaryMusclesWorked: secondary,
            },
            +id,
          );
        });
      });
    }
    if (requiresBioMetricDateUpdate) {
      // get every bioEntry and change the format of the date
      getFromCursorUtil(database, objectStores.bioEntries).then(async (res) => {
        const entryStore = database
          .transaction(objectStores.bioEntries, 'readwrite')
          .objectStore(objectStores.bioEntries);
        Object.entries(res || {}).forEach(([id, entry]) => {
          entryStore.put(
            {
              ...entry,
              date: new Date(entry.date).getTime(),
            },
            +id,
          );
        });
      });
    }

    callback(dbRequest.result);
  };

  dbRequest.onerror = (e) => {
    console.warn('error:', e);
  };
  dbRequest.onupgradeneeded = (e) => {
    const db = e.target.result;

    if (e.oldVersion < 1) {
      requiresExercises = true;
      // this is the first time this db has been initialized
      // it's safe to initialize all object stores
      db.createObjectStore(objectStores.wendlerCycles, {
        autoIncrement: true,
      });
      const exerciseStore = db.createObjectStore(objectStores.exercises, {
        autoIncrement: true,
      });
      exerciseStore.createIndex('name', 'name', { unique: true });
      exerciseStore.createIndex('primaryGroup', 'primaryGroup', {
        unique: false,
      });

      const setsStore = db.createObjectStore(objectStores.sets, {
        autoIncrement: true,
      });
      setsStore.createIndex('exercise', 'exercise', { unique: false });
    }
    if (e.oldVersion < 2) {
      // get setsStore and createIndex
      const setStore = e.currentTarget.transaction.objectStore(
        objectStores.sets,
      );
      setStore.createIndex('created', 'created', { unique: false });
    }
    if (e.oldVersion < 3) {
      requiresBioMetrics = true;
      // adding bio metrics
      // add a store for what you want to track
      // and one for entries
      const bioMetricStore = db.createObjectStore(objectStores.bioMetrics, {
        autoIncrement: true,
      });
      bioMetricStore.createIndex('name', 'name', { unique: true });
      bioMetricStore.createIndex('created', 'created', { unique: false });
      const bioEntriesStore = db.createObjectStore(objectStores.bioEntries, {
        autoIncrement: true,
      });
      bioEntriesStore.createIndex('bioMetric', 'bioMetric', { unique: false });
      bioEntriesStore.createIndex('date', 'date', { unique: false });
      bioMetricStore.add({ name: 'weight', created: new Date().getTime() });
    }
    if (e.oldVersion < 4) {
      requiresExerciseGroupRefactor = true;
      const musclesStore = db.createObjectStore(objectStores.muscleGroups, {
        autoIncrement: true,
      });
      musclesStore.createIndex('name', 'name', { unique: true });
      musclesStore.createIndex('isPrimary', 'isPrimary', { unique: false });
      musclesStore.createIndex('parentGroup', 'parentGroup', {
        unique: false,
      });
    }
    if (e.oldVersion < 5) {
      // adding fasting timer
      const fastingStore = db.createObjectStore(objectStores.fasting, {
        autoIncrement: true,
      });
      fastingStore.createIndex('created', 'created', { unique: true });
    }
    if (e.oldVersion < 6) {
      // adding routines
      const routineStore = db.createObjectStore(objectStores.routines, {
        autoIncrement: true,
      });
      routineStore.createIndex('name', 'name', { unique: false });
      routineStore.createIndex('id', 'id', { unique: true });
    }
    if (e.oldVersion < 8) {
      // updating muscle groups.
      requiresMuscleGroupUpdate = true;
    }
    if (e.oldVersion < 9) {
      requiresBioMetricDateUpdate = true;
    }
  };
};

export default initializeDb;
