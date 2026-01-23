import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TranslationForm } from '@/components/forms/TranslationForm';
import { translationsApi } from '@/lib/api';
import { toast } from 'sonner';
import { ROUTES } from '@/config/constants';
import type { TranslationInput } from '@/lib/types';

export function CreateTranslation() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: TranslationInput) => {
    setLoading(true);
    try {
      await translationsApi.create(values);
      toast.success('Translation created successfully');
      navigate(ROUTES.ADMIN.TRANSLATIONS);
    } catch (error) {
      toast.error('Failed to create translation');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create Translation
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Add a new translation key for Uzbek, Russian, and Kiril (Cyrillic).
        </p>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-800">
        <TranslationForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}
