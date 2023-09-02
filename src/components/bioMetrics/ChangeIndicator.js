import { h } from 'preact';
import Icon from '../icon/Icon';
import { formatToFixed } from '../../utilities.js/formatNumbers';

const ChangeIndicator = ({ number }) => (
  <>
    {number !== undefined && (
      <>
        {number !== 0 && (
          <Icon name={number > 0 ? 'arrow-up-outline' : 'arrow-down-outline'} />
        )}
        <span className="ml-2 text-sm">
          {number === 0 ? '--' : formatToFixed(number)}
        </span>
      </>
    )}
  </>
);

export default ChangeIndicator;
