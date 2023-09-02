import { h } from 'preact';
import LinkList from '../../components/linkList/LinkList';
import { routes } from '../../config/routes';

const BioMetricsList = ({ bioMetrics }) => {
  const links = Object.entries({ ...bioMetrics }).map(([id, data]) => {
    return {
      href: `${routes.bioMetricsBase}/${id}`,
      text: data.name,
    };
  });
  return (
    <div>
      <h1>Bio Metrics</h1>
      <LinkList
        links={[
          ...links,
          {
            href: `${routes.bioMetricsBase}/new`,
            text: 'Add New',
          },
        ]}
      />
    </div>
  );
};

export default BioMetricsList;
