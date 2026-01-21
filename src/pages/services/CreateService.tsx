import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ServiceForm } from '@/components/forms/ServiceForm';
import { servicesApi, createFormData } from '@/lib/api';
import { toast } from 'sonner';
import { ROUTES } from '@/config/constants';

export function CreateService() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const formData = createFormData(values);
      await servicesApi.create(formData);
      toast.success('Service created successfully');
      navigate(ROUTES.ADMIN.SERVICES);
    } catch (error) {
      toast.error('Failed to create service');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create Service
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Add a new service to your offering.
        </p>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-800">
        <ServiceForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}
