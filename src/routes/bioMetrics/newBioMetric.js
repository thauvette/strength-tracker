import { h } from 'preact'
import { route } from 'preact-router'
import { routes } from '../../config/routes'
import useDB from '../../context/db'

const NewBioMetric = ({ onSubmit }) => {
  const { createBioMetric } = useDB()
  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    createBioMetric(formData.get('name')).then((res) => {
      onSubmit()
      route(`${routes.bioMetrics}/${res.id}`)
    })
  }
  return (
    <div class="p-2">
      <h1>New</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Name</p>
          <input required name="name" type="text" placeholder="name" />
        </label>
        <div class="pt-4 ">
          <button class="w-full btn primary" type="submit">
            Add
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewBioMetric
