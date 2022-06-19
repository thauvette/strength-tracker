import { h } from "preact"
import { useState } from "preact/hooks"
import LinkList from "../../../components/linkList/LinkList"
import { routes } from "../../../config/routes"
import GroupList from "./groupList"

const ExerciseSelection = ({ allExercises, groups, searchText }) => {
  return (
    <div>
      <div>
        {searchText?.length ? (
          <LinkList
            links={allExercises
              .filter(exercise =>
                exercise.name
                  ?.toLowerCase()
                  ?.includes(searchText?.toLowerCase())
              )
              .map(exercise => ({
                href: `${routes.exerciseBase}/${exercise.id}`,
                text: exercise.name,
              }))}
          />
        ) : (
          <GroupList groups={groups} />
        )}
      </div>
    </div>
  )
}

export default ExerciseSelection
