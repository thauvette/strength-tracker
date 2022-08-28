import { h } from "preact"
import { useEffect, useState } from "preact/hooks"
import { Router } from "preact-router"
import set from "lodash.set"
import useDB, { objectStores } from "../../context/db"
import { routes } from "../../config/routes"
import BioMetricsList from "./bioMetricsList"
import BioMetric from "./bioMetric"
import NewBioMetric from "./newBioMetric"

const BioMetrics = () => {
  const { getAllEntries, createEntry } = useDB()
  const [bioList, setBioList] = useState({})
  const [loading, setLoading] = useState(true)
  const fetchBioMetrics = () => {
    const promises = [
      getAllEntries(objectStores.bioMetrics),
      getAllEntries(objectStores.bioEntries),
    ]
    Promise.all(promises)
      .then(([bioMetrics, entries]) => {
        const result = { ...bioMetrics }
        if (entries && Object.keys(entries).length) {
          Object.entries(entries).forEach(([id, entry]) => {
            if (!result?.[entry?.bioMetric]?.items) {
              set(result, [entry?.bioMetric, "items"], [])
            }
            result?.[entry?.bioMetric]?.items.push({
              id,
              ...entry,
            })
          })
        }
        setBioList(result)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchBioMetrics()
  }, []) // eslint-disable-line

  const addEntry = async ({ bioMetricId, data }) => {
    createEntry(objectStores.bioEntries, {
      bioMetric: +bioMetricId,
      ...data,
    }).then(() => {
      fetchBioMetrics()
    })
  }
  if (loading) {
    return null
  }
  return (
    <Router>
      <BioMetricsList path={`${routes.bioMetrics}/`} bioMetrics={bioList} />
      <NewBioMetric
        path={`${routes.bioMetrics}/new`}
        onSubmit={fetchBioMetrics}
      />
      <BioMetric
        path={`${routes.bioMetrics}/:id`}
        addEntry={addEntry}
        bioMetrics={bioList}
      />
    </Router>
  )
}

export default BioMetrics