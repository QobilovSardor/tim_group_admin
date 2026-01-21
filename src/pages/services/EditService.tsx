import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ServiceForm } from '@/components/forms/ServiceForm';
import { servicesApi } from '@/lib/api';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import type { Service } from '@/lib/types';
import { ROUTES } from '@/config/constants';

export function EditService() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [service, setService] = useState<Service | null>(null);

  useEffect(() => {
    async function fetchService() {
      if (!id) return;
      try {
        const response = await servicesApi.getById(Number(id));
        const data = (response.data as any).data || response.data;
        setService(data);
      } catch (error) {
        toast.error('Failed to fetch service details');
        navigate(ROUTES.ADMIN.SERVICES);
      } finally {
        setInitialLoading(false);
      }
    }
    fetchService();
  }, [id, navigate]);

  const handleSubmit = async (values: any) => {
    if (!id) return;
    setLoading(true);
    try {
      // If img is string (existing url), don't include it in update if backend handles it
      // or handle logic in createFormData to only include if File.
      // My createFormData handles File instances.
      // If values.img is string, createFormData will send it as string.
      // Backend might expect file or nothing.
      // Typically update only sends changed fields or all fields.
      // If img is unchanged string, backend might ignore or error if it expects file.
      // Let's ensure we only send file if it's new, or handle in createFormData logic more strictly if needed.
      // For now, if it's a string, we can likely skip sending it or send it and backend handles.
      // But commonly, multipart/form-data expects file field to be file.

      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('sub_title', values.sub_title);
      if (values.img instanceof File) {
        formData.append('img', values.img);
      }

      await servicesApi.update(Number(id), formData);
      toast.success('Service updated successfully');
      navigate('/admin/our-services');
    } catch (error) {
      toast.error('Failed to update service');
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
          Edit Service
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Update service details.
        </p>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-800">
        <ServiceForm
          initialData={service}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
}
