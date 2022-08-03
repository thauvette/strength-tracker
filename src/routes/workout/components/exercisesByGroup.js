import { h } from "preact"
import { useState } from "preact/hooks"

import LinkList from "../../../components/linkList/LinkList"
import { routes } from "../../../config/routes"

const ExercisesByGroup = props => {
  const {
    allExerciseOptions,
    matches: { name },
    searchText,
  } = props

  const groupName = decodeURI(name)
  const matches = allExerciseOptions.filter(
    option =>
      option.primaryGroup === groupName &&
      (!searchText ||
        option.name?.toLowerCase()?.includes(searchText?.toLowerCase()))
  )

  return (
    <div>
      <LinkList
        links={matches.map(exercise => ({
          href: `${routes.exerciseBase}/${exercise.id}`,
          text: exercise.name,
        }))}
      />
    </div>
  )
}

export default ExercisesByGroup
