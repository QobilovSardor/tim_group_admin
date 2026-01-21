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
import { ImageUpload } from '@/components/common/ImageUpload';
import { Loader2 } from 'lucide-react';
import type { Service } from '@/lib/types';
import { useEffect } from 'react';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  sub_title: z.string().min(1, 'Subtitle is required'),
  image: z.union([z.instanceof(File), z.string()]).optional().refine((val) => {
    // If it's a create form (we don't check initialData here, but we can infer requirement),
    // we strictly need validation logic based on usage.
    // For now, let's make it optional in schema and validate manually or rely on required prop if needed.
    // Actually, properly: if string (existing url) or File (new upload).
    return !!val;
  }, 'Image is required'),
});

type FormValues = z.infer<typeof formSchema>;

interface ServiceFormProps {
  initialData?: Service | null;
  onSubmit: (data: FormValues) => void;
  loading?: boolean;
}

export function ServiceForm({ initialData, onSubmit, loading }: ServiceFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      sub_title: '',
      image: undefined,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        sub_title: initialData.sub_title,
        image: initialData.image,
      });
    }
  }, [initialData, form]);

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Service title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sub_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle</FormLabel>
                  <FormControl>
                    <Input placeholder="Service subtitle" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="image"
            render={({ field: { value, onChange } }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={value}
                    onChange={onChange}
                    error={form.formState.errors.image?.message}
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
            {initialData ? 'Update Service' : 'Create Service'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
