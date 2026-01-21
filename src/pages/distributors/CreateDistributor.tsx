import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DistributorForm } from '@/components/forms/DistributorForm';
import { distributorsApi } from '@/lib/api';
import { toast } from 'sonner';
import { ROUTES } from '@/config/constants';

export function CreateDistributor() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('link', values.link);
      if (values.img instanceof File) {
        formData.append('img', values.img);
      }
      await distributorsApi.create(formData);
      toast.success('Distributor created successfully');
      navigate(ROUTES.ADMIN.DISTRIBUTORS);
    } catch (error) {
      toast.error('Failed to create distributor');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create Distributor
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Add a new distributor partner.
        </p>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-800">
        <DistributorForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}
