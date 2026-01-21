import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DistributorForm } from '@/components/forms/DistributorForm';
import { distributorsApi } from '@/lib/api';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import type { Distributor } from '@/lib/types';
import { ROUTES } from '@/config/constants';

export function EditDistributor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [distributor, setDistributor] = useState<Distributor | null>(null);

  useEffect(() => {
    async function fetchDistributor() {
      if (!id) return;
      try {
        const { data } = await distributorsApi.getById(Number(id));
        setDistributor(data);
      } catch (error) {
        toast.error('Failed to fetch distributor details');
        navigate(ROUTES.ADMIN.DISTRIBUTORS);
      } finally {
        setInitialLoading(false);
      }
    }
    fetchDistributor();
  }, [id, navigate]);

  const handleSubmit = async (values: any) => {
    if (!id) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('link', values.link);
      if (values.img instanceof File) {
        formData.append('img', values.img);
      }

      await distributorsApi.update(Number(id), formData);
      toast.success('Distributor updated successfully');
      navigate('/admin/distributors');
    } catch (error) {
      toast.error('Failed to update distributor');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Edit Distributor
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Update distributor details.
        </p>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-800">
        <DistributorForm
          initialData={distributor}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
}
