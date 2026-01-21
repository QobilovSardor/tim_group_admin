import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import { DeleteDialog } from '@/components/common/DeleteDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { distributorsApi } from '@/lib/api';
import type { Distributor } from '@/lib/types';
import type { Column } from '@/components/common/DataTable';
import { toast } from 'sonner';
import { ROUTES } from '@/config/constants';

export function DistributorsList() {
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchDistributors = async () => {
    try {
      const response = await distributorsApi.getAll();
      // Handle both direct array and wrapped { data: [...] } response
      const data = Array.isArray(response.data)
        ? response.data
        : (response.data as any).data || [];
      setDistributors(data);
    } catch (error) {
      toast.error('Failed to fetch distributors');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDistributors();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;

    setDeleting(true);
    try {
      await distributorsApi.delete(deleteId);
      toast.success('Distributor deleted successfully');
      setDistributors((prev) => prev.filter((d) => d.id !== deleteId));
    } catch (error) {
      toast.error('Failed to delete distributor');
      console.error(error);
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const columns: Column<Distributor>[] = [
    {
      key: 'img',
      header: 'Logo',
      render: (distributor) => (
        <div className="h-12 w-20 overflow-hidden rounded-md border bg-white p-1">
          <img
            src={distributor.image}
            alt={distributor.title}
            className="h-full w-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Logo';
            }}
          />
        </div>
      ),
    },
    {
      key: 'title',
      header: 'Name',
      sortable: true,
      render: (distributor) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {distributor.title}
        </span>
      ),
    },
    {
      key: 'link',
      header: 'Website',
      render: (distributor) => (
        <a
          href={distributor.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-cyan-600 hover:text-cyan-700 hover:underline"
        >
          Visit <ExternalLink className="h-3 w-3" />
        </a>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (distributor) => (
        <div className="flex items-center justify-end gap-2">
          <Link to={ROUTES.ADMIN.DISTRIBUTORS_EDIT(distributor.id)}>
            <Button variant="ghost" size="icon">
              <Pencil className="h-4 w-4 text-gray-500 hover:text-cyan-600" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteId(distributor.id)}
          >
            <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  if (!loading && distributors.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Distributors
        </h1>
        <EmptyState
          title="No distributors found"
          description="Get started by adding your first distributor."
          actionLabel="Add Distributor"
          actionHref={ROUTES.ADMIN.DISTRIBUTORS_NEW}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Distributors
        </h1>
        <Link to={ROUTES.ADMIN.DISTRIBUTORS_NEW}>
          <Button className="bg-cyan-600 hover:bg-cyan-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Distributor
          </Button>
        </Link>
      </div>

      <DataTable
        data={distributors}
        columns={columns}
        loading={loading}
        searchKey="title"
        searchPlaceholder="Search distributors..."
      />

      <DeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Distributor"
        description="Are you sure you want to delete this distributor? This action cannot be undone."
        loading={deleting}
      />
    </div>
  );
}
