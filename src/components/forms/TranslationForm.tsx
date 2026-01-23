import { useEffect } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import type { Translation } from '@/lib/types';

const formSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  name_uz: z.string().min(1, 'Uzbek translation is required'),
  name_ru: z.string().min(1, 'Russian translation is required'),
  name_kr: z.string().min(1, 'Kiril translation is required'),
  is_use: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface TranslationFormProps {
  initialData?: Translation | null;
  onSubmit: (data: FormValues) => void;
  loading?: boolean;
}

export function TranslationForm({ initialData, onSubmit, loading }: TranslationFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      key: '',
      name_uz: '',
      name_ru: '',
      name_kr: '',
      is_use: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        key: initialData.key,
        name_uz: initialData.name_uz,
        name_ru: initialData.name_ru,
        name_kr: initialData.name_kr,
        is_use: Boolean(initialData.is_use),
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
          <FormField
            control={form.control}
            name="key"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Key</FormLabel>
                <FormControl>
                  <Input placeholder="home.title" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_use"
            render={({ field }) => (
              <FormItem className="space-y-2 rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <FormLabel className="mb-0">Is Use</FormLabel>
                    <p className="text-xs text-gray-500">Active translation</p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <FormField
            control={form.control}
            name="name_uz"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Uzbek / O'zbek (UZ)</FormLabel>
                <FormControl>
                  <Input placeholder="O'zbekcha matn" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name_ru"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Russian / Русский (RU)</FormLabel>
                <FormControl>
                  <Input placeholder="Русский текст" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name_kr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kiril / Кирил (KR)</FormLabel>
                <FormControl>
                  <Input placeholder="Кирилл матн" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? 'Update Translation' : 'Create Translation'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
