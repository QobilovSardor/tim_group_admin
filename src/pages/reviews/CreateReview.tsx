import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReviewForm } from '@/components/forms/ReviewForm';
import { reviewsApi } from '@/lib/api';
import { toast } from 'sonner';
import { ROUTES } from '@/config/constants';

export function CreateReview() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('user_name', values.user_name);
      formData.append('user_review', values.user_review);
      if (values.user_img instanceof File) {
        formData.append('user_img', values.user_img);
      }

      await reviewsApi.create(formData);
      toast.success('Review created successfully');
      navigate(ROUTES.ADMIN.REVIEWS);
    } catch (error) {
      toast.error('Failed to create review');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create Review
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Add a new review from a customer.
        </p>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-800">
        <ReviewForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}
