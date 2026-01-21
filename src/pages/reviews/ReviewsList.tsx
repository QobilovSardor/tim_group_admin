import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import { DeleteDialog } from '@/components/common/DeleteDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { reviewsApi } from '@/lib/api';
import type { Review } from '@/lib/types';
import type { Column } from '@/components/common/DataTable';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ROUTES } from '@/config/constants';

export function ReviewsList() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchReviews = async () => {
    try {
      const response = await reviewsApi.getAll();
      // Handle both direct array and wrapped { data: [...] } response
      const data = Array.isArray(response.data)
        ? response.data
        : (response.data as any).data || [];
      setReviews(data);
    } catch (error) {
      toast.error('Failed to fetch reviews');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;

    setDeleting(true);
    try {
      await reviewsApi.delete(deleteId);
      toast.success('Review deleted successfully');
      setReviews((prev) => prev.filter((r) => r.id !== deleteId));
    } catch (error) {
      toast.error('Failed to delete review');
      console.error(error);
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const columns: Column<Review>[] = [
    {
      key: 'user_img',
      header: 'User',
      render: (review) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={review.user_img} alt={review.user_name} />
            <AvatarFallback>{review.user_name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-gray-900 dark:text-white">
            {review.user_name}
          </span>
        </div>
      ),
    },
    {
      key: 'user_review',
      header: 'Review',
      render: (review) => (
        <span className="text-gray-500 line-clamp-2 max-w-md" title={review.user_review}>
          {review.user_review}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (review) => (
        <div className="flex items-center justify-end gap-2">
          <Link to={ROUTES.ADMIN.REVIEWS_EDIT(review.id)}>
            <Button variant="ghost" size="icon">
              <Pencil className="h-4 w-4 text-gray-500 hover:text-cyan-600" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteId(review.id)}
          >
            <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  if (!loading && reviews.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Reviews
        </h1>
        <EmptyState
          title="No reviews found"
          description="Get started by creating your first review."
          actionLabel="Add Review"
          actionHref={ROUTES.ADMIN.REVIEWS_NEW}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Reviews
        </h1>
        <Link to={ROUTES.ADMIN.REVIEWS_NEW}>
          <Button className="bg-cyan-600 hover:bg-cyan-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Review
          </Button>
        </Link>
      </div>

      <DataTable
        data={reviews}
        columns={columns}
        loading={loading}
        searchKey="user_name"
        searchPlaceholder="Search reviews..."
      />

      <DeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Review"
        description="Are you sure you want to delete this review? This action cannot be undone."
        loading={deleting}
      />
    </div>
  );
}
