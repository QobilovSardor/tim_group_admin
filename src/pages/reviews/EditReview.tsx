import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ReviewForm } from '@/components/forms/ReviewForm';
import { reviewsApi } from '@/lib/api';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import type { Review } from '@/lib/types';
import { ROUTES } from '@/config/constants';

export function EditReview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [review, setReview] = useState<Review | null>(null);

  useEffect(() => {
    async function fetchReview() {
      if (!id) return;
      try {
        const response = await reviewsApi.getById(Number(id));
        const data = (response.data as any).data || response.data;
        setReview(data);
      } catch (error) {
        toast.error('Failed to fetch review details');
        navigate('/admin/reviews');
      } finally {
        setInitialLoading(false);
      }
    }
    fetchReview();
  }, [id, navigate]);

  const handleSubmit = async (values: any) => {
    if (!id) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('user_name', values.user_name);
      formData.append('user_review', values.user_review);
      if (values.user_img instanceof File) {
        formData.append('user_img', values.user_img);
      }

      await reviewsApi.update(Number(id), formData);
      toast.success('Review updated successfully');
      navigate(ROUTES.ADMIN.REVIEWS);
    } catch (error) {
      toast.error('Failed to update review');
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
          Edit Review
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Update review details.
        </p>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-800">
        <ReviewForm
          initialData={review}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
}
