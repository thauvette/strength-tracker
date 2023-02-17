import { h } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { Router } from 'preact-router'
import set from 'lodash.set'
import useDB from '../context/db/db'
import { objectStores } from '../context/db/config'
import { routes } from '../config/routes'
import BioMetricsList from '../components/bioMetrics/bioMetricsList'
import BioMetric from '../components/bioMetrics/bioMetric'
import NewBioMetric from '../components/bioMetrics/newBioMetric'

const BioMetrics = () => {
  const { getAllEntries, createEntry, updateEntry, deleteEntry } = useDB()
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
              set(result, [entry?.bioMetric, 'items'], [])
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

  const addEntry = ({ bioMetricId, data }) => {
    createEntry(objectStores.bioEntries, {
      bioMetric: +bioMetricId,
      ...data,
    }).then(() => {
      fetchBioMetrics()
    })
  }

  const editEntry = (id, data) => {
    updateEntry(objectStores.bioEntries, id, data).then(() => fetchBioMetrics())
  }

  const removeEntry = (id) =>
    deleteEntry(objectStores.bioEntries, id).then(() => fetchBioMetrics())

  if (loading) {
    return null
  }

  return (
    <Router>
      <BioMetricsList path={`${routes.bioMetricsBase}`} bioMetrics={bioList} />
      <NewBioMetric
        path={`${routes.bioMetricsBase}/new`}
        onSubmit={fetchBioMetrics}
      />
      <BioMetric
        path={`${routes.bioMetricsBase}/:id/:remaining_path*`}
        addEntry={addEntry}
        editEntry={editEntry}
        bioMetrics={bioList}
        removeEntry={removeEntry}
      />
    </Router>
  )
}

export default BioMetrics
