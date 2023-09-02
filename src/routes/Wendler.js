import { h } from 'preact';
import { route, Router } from 'preact-router';
import { useState } from 'preact/hooks';
import { routes } from '../config/routes';
import NewSchedule from '../components/wendler/newSchedule';
import Preview from '../components/wendler/preview';
import WendlerCycle from '../components/wendler/WendlerCycle';
import WendlerCycles from '../components/wendler/WendlerCycles';
import WendlerWorkout from '../components/wendler/WendlerWorkout';

const scrollToTop = () => {
  if (typeof window !== 'undefined') {
    window.scrollTo(0, 0);
  }
};

const Wendler = () => {
  const [newWendlerData, setNewWendlerData] = useState(null);

  const navigateToEdit = (workout) => {
    setNewWendlerData({
      ...workout,
      exercises: workout?.exerciseFormValues,
    });
    route(routes.wendlerNew);
  };

  return (
    <Router onChange={scrollToTop}>
      <WendlerCycles
        path={routes.wendlerCycles}
        navigateToEdit={navigateToEdit}
      />
      <NewSchedule
        path={routes.wendlerNew}
        onSubmit={(data) => {
          setNewWendlerData({
            preview: data.preview,
            title: newWendlerData?.title || '',
            description: newWendlerData?.description || '',
            created: newWendlerData?.created || null,
            id: newWendlerData?.id || null,
            exercises: data.exercises,
            auxVersion: data.auxVersion,
          });
        }}
        savedExercises={newWendlerData?.exercises}
        initialValues={newWendlerData}
      />
      <Preview path={routes.wendlerNewPreview} initialValues={newWendlerData} />
      <WendlerCycle path={routes.wendlerCycle} />
      <WendlerWorkout path={routes.wendlerDay} />
    </Router>
  );
};

export default Wendler;
