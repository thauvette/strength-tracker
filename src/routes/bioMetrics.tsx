import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Route, Router } from 'preact-router';
import { set } from 'lodash';
import useDB from '../context/db/db';
import { objectStores } from '../context/db/config';
import { routes } from '../config/routes.js';
import BioMetricsList from '../components/bioMetrics/bioMetricsList.js';
import BioMetric from '../components/bioMetrics/bioMetric.js';
import NewBioMetric from '../components/bioMetrics/newBioMetric.js';
import { BioEntry, BioMetric as IBioMetric } from '../context/db/types.js';

interface BioItem extends BioEntry {
  id?: string;
}

interface Result extends IBioMetric {
  items?: BioItem[];
}

interface Results {
  [key: string]: Result;
}

const BioMetrics = () => {
  const { getAllEntries, createEntry, updateEntry, deleteEntry } = useDB();
  const [bioList, setBioList] = useState({});
  const [loading, setLoading] = useState(true);
  const fetchBioMetrics = () => {
    const promises = [
      getAllEntries<IBioMetric>(objectStores.bioMetrics),
      getAllEntries<BioEntry>(objectStores.bioEntries),
    ];
    Promise.all(promises)
      .then(
        ([bioMetrics, entries]: [
          { [key: string]: IBioMetric },
          { [key: string]: BioEntry },
        ]) => {
          const result: Results = { ...bioMetrics };
          if (entries && Object.keys(entries).length) {
            Object.entries(entries).forEach(([id, entry]) => {
              if (!result?.[entry?.bioMetric]?.items) {
                set(result, [entry?.bioMetric, 'items'], []);
              }
              result?.[entry?.bioMetric]?.items.push({
                id,
                ...entry,
              });
            });
          }
          setBioList(result);
        },
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBioMetrics();
  }, []); // eslint-disable-line

  const addEntry = ({ bioMetricId, data }) => {
    createEntry(objectStores.bioEntries, {
      bioMetric: +bioMetricId,
      ...data,
      date: new Date(data.date).getTime(),
    }).then(() => {
      fetchBioMetrics();
    });
  };

  const editEntry = (id, data) => {
    updateEntry(objectStores.bioEntries, id, data).then(() =>
      fetchBioMetrics(),
    );
  };

  const removeEntry = (id) =>
    deleteEntry(objectStores.bioEntries, id).then(() => fetchBioMetrics());

  if (loading) {
    return null;
  }

  return (
    <Router>
      <Route
        path={`${routes.bioMetricsBase}`}
        component={BioMetricsList}
        bioMetrics={bioList}
      />
      <Route
        path={`${routes.bioMetricsBase}/new`}
        component={NewBioMetric}
        onSubmit={fetchBioMetrics}
      />
      <Route
        path={`${routes.bioMetricsBase}/:id/:remaining_path*`}
        component={BioMetric}
        addEntry={addEntry}
        editEntry={editEntry}
        bioMetrics={bioList}
        removeEntry={removeEntry}
      />
    </Router>
  );
};

export default BioMetrics;
