import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import { DeleteDialog } from '@/components/common/DeleteDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { servicesApi } from '@/lib/api';
import type { Service } from '@/lib/types';
import type { Column } from '@/components/common/DataTable';
import { toast } from 'sonner';
import { API_CONFIG, ROUTES } from '@/config/constants';

export function ServicesList() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchServices = async () => {
    try {
      const response = await servicesApi.getAll();
      // Handle both direct array and wrapped { data: [...] } response
      const data = Array.isArray(response.data)
        ? response.data
        : (response.data as any).data || [];
      setServices(data);
    } catch (error) {
      toast.error('Failed to fetch services');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;

    setDeleting(true);
    try {
      await servicesApi.delete(deleteId);
      toast.success('Service deleted successfully');
      setServices((prev) => prev.filter((s) => s.id !== deleteId));
    } catch (error) {
      toast.error('Failed to delete service');
      console.error(error);
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const columns: Column<Service>[] = [
    {
      key: 'img',
      header: 'Image',
      render: (service) => {
        const imageUrl = service.img ? (service.img.startsWith('http') ? service.img : `${API_CONFIG.BASE_URL}${service.img}`) : '';
        const placeholder = 'https://via.placeholder.com/150?text=No+Image';

        return (
          <div className="h-12 w-20 overflow-hidden rounded-md border bg-gray-50">
            <img
              src={imageUrl || placeholder}
              alt={service.title}
              className="h-full w-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src !== placeholder) {
                  target.src = placeholder;
                }
              }}
            />
          </div>
        );
      },
    },
    {
      key: 'title',
      header: 'Title',
      sortable: true,
      render: (service) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {service.title}
        </span>
      ),
    },
    {
      key: 'sub_title',
      header: 'Subtitle',
      render: (service) => (
        <span className="text-gray-500 line-clamp-1">{service.sub_title}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (service) => (
        <div className="flex items-center justify-end gap-2">
          <Link to={ROUTES.ADMIN.SERVICES_EDIT(service.id)}>
            <Button variant="ghost" size="icon">
              <Pencil className="h-4 w-4 text-gray-500 hover:text-cyan-600" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteId(service.id)}
          >
            <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  if (!loading && services.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Our Services
          </h1>
        </div>
        <EmptyState
          title="No services found"
          description="Get started by creating your first service."
          actionLabel="Add Service"
          actionHref={ROUTES.ADMIN.SERVICES_NEW}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Our Services
        </h1>
        <Link to={ROUTES.ADMIN.SERVICES_NEW}>
          <Button className="bg-cyan-600 hover:bg-cyan-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </Link>
      </div>

      <DataTable
        data={services}
        columns={columns}
        loading={loading}
        searchKey="title"
        searchPlaceholder="Search services..."
      />

      <DeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Service"
        description="Are you sure you want to delete this service? This action cannot be undone."
        loading={deleting}
      />
    </div>
  );
}
