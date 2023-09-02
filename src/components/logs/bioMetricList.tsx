import { h } from 'preact';
import { Link } from 'preact-router';
import { routes } from '../../config/routes';
import dayjs from 'dayjs';
import dateFormats from '../../config/dateFormats';

interface Props {
  bioMetrics?: {
    [key: number]: {
      name: string;
      bioId: number;
      items: {
        bioMetric: number;
        created: number;
        date: number;
        value: number;
      }[];
    };
  };
}

const BioMetricList = ({ bioMetrics = {} }: Props) => {
  return (
    <div>
      <h1 class="my-4">Bio metrics</h1>
      {Object.entries(bioMetrics).map(([id, bioMetric]) => (
        <div key={id} class="mb-4 card p-4">
          <div class="flex items-center justify-between">
            <p class="font-bold capitalize">{bioMetric.name}</p>
            <div class="flex justify-end">
              <Link href={`${routes.bioMetricsBase}/${bioMetric.bioId}`}>
                View
              </Link>
            </div>
          </div>
          {bioMetric.items?.length
            ? bioMetric.items.map((item) => (
                <div key={item.created}>
                  <p>
                    {dayjs(item.date).format(dateFormats.time)} - {item.value}
                  </p>
                </div>
              ))
            : null}
        </div>
      ))}
    </div>
  );
};

export default BioMetricList;
