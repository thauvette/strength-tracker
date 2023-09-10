import { Link } from 'preact-router';
import { routes } from '../../config/routes';

const ExerciseLinks = ({ path, id }: { path: string; id: number }) => (
  <div class="flex pb-4">
    <Link
      href={`${routes.exerciseBase}/${id}`}
      class={`px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100 no-underline border-b-4 border-highlight-900 dark:border-highlight-200 ${
        !path ? '' : 'border-opacity-0 dark:border-opacity-0'
      }`}
    >
      Track
    </Link>
    <Link
      href={`${routes.exerciseBase}/${id}/history`}
      class={`px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100 no-underline border-b-4 border-highlight-900 dark:border-highlight-200 ${
        path === 'history' ? '' : 'border-opacity-0 dark:border-opacity-0'
      }`}
    >
      History
    </Link>
    <Link
      href={`${routes.exerciseBase}/${id}/edit`}
      class={`px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100 no-underline border-b-4 border-highlight-900 dark:border-highlight-200 ${
        path === 'edit' ? '' : 'border-opacity-0 dark:border-opacity-0'
      }`}
    >
      Edit
    </Link>
    <Link
      href={`${routes.exerciseBase}/${id}/planned`}
      class={`px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100 no-underline border-b-4 border-highlight-900 dark:border-highlight-200 ${
        path === 'planned' ? '' : 'border-opacity-0 dark:border-opacity-0'
      }`}
    >
      Plan
    </Link>
  </div>
);

export default ExerciseLinks;
