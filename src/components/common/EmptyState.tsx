import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileQuestion, Plus } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = 'No data found',
  description = 'Get started by creating your first item.',
  icon,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
        {icon || <FileQuestion className="h-8 w-8 text-gray-400" />}
      </div>

      <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
        {title}
      </h3>

      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>

      {(actionLabel && actionHref) && (
        <Link to={actionHref}>
          <Button className="mt-6 bg-cyan-600 hover:bg-cyan-700">
            <Plus className="mr-2 h-4 w-4" />
            {actionLabel}
          </Button>
        </Link>
      )}

      {(actionLabel && onAction && !actionHref) && (
        <Button
          className="mt-6 bg-cyan-600 hover:bg-cyan-700"
          onClick={onAction}
        >
          <Plus className="mr-2 h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
