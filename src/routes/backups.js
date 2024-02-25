import { h } from 'preact';
import { useState } from 'preact/hooks';
import dayjs from 'dayjs';

import Modal from '../components/modal/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

import {
  ARRAY_SEPARATOR,
  COMMA_REPLACEMENT,
  LINE_BREAK,
} from '../config/constants';
import useDB from '../context/db/db.tsx';
import { objectStores } from '../context/db/config.ts';

export default function Backups() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedData, setUploadedData] = useState(null);

  const { createBackup, restoreFromBackup } = useDB();

  const readFile = (file) => {
    const reader = new FileReader();
    reader.onload = function readSuccess(e) {
      try {
        const rows = e.target.result.split('\n');
        const headers = rows[0].split(',');
        const result = rows.reduce(
          (obj, row, i) => {
            // rows[0] is the headers
            if (i) {
              const items = row.split(',');
              // items 0 and 1 are store and id, everything else goes under value
              // we no longer allow customizing muscle groups
              if (items[0] === objectStores.muscleGroups) {
                return obj;
              }

              const data = {};
              const values = items.slice(2);
              values.forEach((value, index) => {
                if (value) {
                  let formattedValue;
                  if (
                    (items[0] === objectStores.routines &&
                      headers[index + 2] === 'days') ||
                    (items[0] === objectStores.wendlerCycles &&
                      (headers[index + 2] === 'exerciseFormValues' ||
                        headers[index + 2] === 'weeks'))
                  ) {
                    try {
                      formattedValue = JSON.parse(atob(value));
                    } catch (e) {
                      formattedValue = [];
                    }
                  } else if (
                    items[0] === objectStores.bioEntries &&
                    headers[index + 2] === 'date'
                  ) {
                    formattedValue = dayjs(value).toDate().getTime();
                  } else if (value.includes(ARRAY_SEPARATOR)) {
                    // this is an array.
                    // we'll split it and then turn numbers back to numbers as they are probably tied to other ids.
                    formattedValue = value
                      .split(ARRAY_SEPARATOR)
                      ?.map((val) => (isNaN(val) ? val : +val));
                  } else if (value === 'false' || value === 'true') {
                    formattedValue = value === 'true';
                  } else {
                    formattedValue = isNaN(value)
                      ? value
                          .replace(COMMA_REPLACEMENT, ',')
                          .replace(LINE_BREAK, '\n')
                      : +value;
                  }

                  data[headers[index + 2]] = formattedValue;
                }
              });

              if (!obj.stores.includes(items[0])) {
                obj.stores.push(items[0]);
              }
              obj.items.push({
                store: items[0],
                // fix for some wendler cycles not having ids.
                id: items[1] ? (isNaN(items[1]) ? items[1] : +items[1]) : i + 1,
                data,
              });
            }
            return obj;
          },
          { stores: [], items: [] },
        );
        // pass this to DB to create entries.
        setUploadedData(result);
      } catch (err) {
        console.log(err);
      }
    };
    reader.readAsText(file);
  };
  function submit(e) {
    setIsLoading(true);
    e.preventDefault();
    const formData = new FormData(e.target);

    restoreFromBackup({
      ...uploadedData,
      stores: formData.get('overwrite') === 'on' ? uploadedData.stores : [],
    })
      .then(() => {
        setIsLoading(false);
        alert('DATA RESTORED');
      })
      .catch((err) => {
        setError(err?.message || 'Restore partially unsuccessful');
        setIsLoading(false);
      });
  }
  return (
    <div class="px-2">
      {error && (
        <div class="p-4 border border-red bg-red-50 bg-opacity-80">
          <p class="text-red font-bold">{error}</p>
        </div>
      )}
      <div class="border-b-2 pb-8 mb-8">
        <h2 class="my-2">Back Up</h2>
        <p class="my-4">Automatically generate and download your backup</p>
        <button class="w-full btn primary" onClick={createBackup}>
          BACK UP
        </button>
      </div>
      <h2 class="my-2">Restore</h2>
      <p class="my-2">Restore from a backup. </p>
      <form onSubmit={submit}>
        <label class="flex items-center">
          <input name="overwrite" type="checkbox" />
          <p class="ml-2">Overwrite any existing data</p>
        </label>
        <label>
          <p>Select your file</p>
          <input
            type="file"
            id="upload"
            onInput={(e) => readFile(e?.target?.files?.[0])}
            accept=".csv"
            class="py-2"
          />
        </label>
        <button
          disabled={!uploadedData}
          class="btn primary w-full mt-8 disabled:opacity-80"
          type="submit"
        >
          Upload
        </button>
      </form>
      <Modal isOpen={isLoading}>
        <div class="flex flex-col items-center">
          <LoadingSpinner />
          <p className="my-2">
            Loading, this may take a bit depending on the size of the backup.
          </p>
        </div>
      </Modal>
    </div>
  );
}
