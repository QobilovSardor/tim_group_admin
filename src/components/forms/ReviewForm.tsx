import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/common/ImageUpload';
import { Loader2 } from 'lucide-react';
import type { Review } from '@/lib/types';
import { useEffect } from 'react';

const formSchema = z.object({
  user_name: z.string().min(1, 'User name is required'),
  user_review: z.string().min(1, 'Review text is required'),
  user_img: z.union([z.instanceof(File), z.string()]).optional().refine((val) => !!val, 'User image is required'),
});

type FormValues = z.infer<typeof formSchema>;

interface ReviewFormProps {
  initialData?: Review | null;
  onSubmit: (data: FormValues) => void;
  loading?: boolean;
}

export function ReviewForm({ initialData, onSubmit, loading }: ReviewFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_name: '',
      user_review: '',
      user_img: undefined,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        user_name: initialData.user_name,
        user_review: initialData.user_review,
        user_img: initialData.user_img,
      });
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="user_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="user_review"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review Text</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter review content..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="user_img"
            render={({ field: { value, onChange } }) => (
              <FormItem>
                <FormLabel>User Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={value}
                    onChange={onChange}
                    error={form.formState.errors.user_img?.message}
                    disabled={loading}
                    className="h-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? 'Update Review' : 'Create Review'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
