import { h } from "preact"
import { route, Router } from "preact-router"
import { useState } from "preact/hooks"
import { routes } from "../../config/routes"
import NewSchedule from "./newSchedule/newSchedule"
import Preview from "./newSchedule/components/preview"
import WendlerCycle from "./WendlerCycle"
import WendlerCycles from "./WendlerCycles"
import WendlerWorkout from "./WendlerWorkout"

const scrollToTop = () => {
  if (typeof window !== "undefined") {
    window.scrollTo(0, 0)
  }
}

const Wendler = () => {
  const [newWendlerData, setNewWendlerData] = useState(null)

  const navigateToEdit = workout => {
    setNewWendlerData({
      ...workout,
      exercises: workout?.exerciseFormValues,
    })
    route(routes.wendlerNew)
  }

  return (
    <Router onChange={scrollToTop}>
      <WendlerCycles
        path={routes.wendlerCycles}
        navigateToEdit={navigateToEdit}
      />
      <NewSchedule
        path={routes.wendlerNew}
        onSubmit={data => {
          setNewWendlerData({
            preview: data.preview,
            title: newWendlerData?.title || "",
            description: newWendlerData?.description || "",
            created: newWendlerData?.created || null,
            id: newWendlerData?.id || null,
            exercises: data.exercises,
            auxVersion: data.auxVersion,
          })
        }}
        savedExercises={newWendlerData?.exercises}
        initialValues={newWendlerData}
      />
      <Preview path={routes.wendlerNewPreview} initialValues={newWendlerData} />
      <WendlerCycle path={routes.wendlerCycle} />
      <WendlerWorkout path={routes.wendlerDay} />
    </Router>
  )
}

export default Wendler
