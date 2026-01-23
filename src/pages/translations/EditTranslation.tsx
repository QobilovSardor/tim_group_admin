import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TranslationForm } from '@/components/forms/TranslationForm';
import { translationsApi } from '@/lib/api';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import type { Translation, TranslationInput } from '@/lib/types';
import { ROUTES } from '@/config/constants';

export function EditTranslation() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [translation, setTranslation] = useState<Translation | null>(null);

  useEffect(() => {
    async function fetchTranslation() {
      if (!id) return;
      try {
        const response = await translationsApi.getById(id);
        const data = (response.data as any).data || response.data;
        setTranslation(data);
      } catch (error) {
        toast.error('Failed to fetch translation details');
        navigate(ROUTES.ADMIN.TRANSLATIONS);
      } finally {
        setInitialLoading(false);
      }
    }
    fetchTranslation();
  }, [id, navigate]);

  const handleSubmit = async (values: TranslationInput) => {
    if (!id) return;
    setLoading(true);
    try {
      await translationsApi.update(id, values);
      toast.success('Translation updated successfully');
      navigate(ROUTES.ADMIN.TRANSLATIONS);
    } catch (error) {
      toast.error('Failed to update translation');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[320px] w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Edit Translation
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Update translation values and status.
        </p>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-800">
        <TranslationForm
          initialData={translation}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
}
