import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DeleteDialog } from '@/components/common/DeleteDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { translationsApi } from '@/lib/api';
import type { Translation } from '@/lib/types';
import { toast } from 'sonner';
import { ROUTES } from '@/config/constants';

interface PaginationState {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const normalizePagination = (
  payload: any,
  fallbackPage: number,
  fallbackLimit: number
) => {
  const directArray = Array.isArray(payload) ? payload : null;
  const nestedData = payload?.data;
  const items =
    directArray ||
    (Array.isArray(nestedData) ? nestedData : null) ||
    (Array.isArray(payload?.items) ? payload.items : null) ||
    (Array.isArray(payload?.results) ? payload.results : null) ||
    (Array.isArray(nestedData?.items) ? nestedData.items : null) ||
    (Array.isArray(nestedData?.data) ? nestedData.data : null) ||
    [];

  const meta = payload?.meta || payload?.pagination || nestedData?.meta || {};
  const total =
    payload?.total ??
    nestedData?.total ??
    meta?.total ??
    payload?.count ??
    nestedData?.count ??
    items.length;
  const limit = payload?.limit ?? nestedData?.limit ?? meta?.limit ?? fallbackLimit;
  const page = payload?.page ?? nestedData?.page ?? meta?.page ?? fallbackPage;
  const totalPages =
    payload?.totalPages ??
    nestedData?.totalPages ??
    meta?.totalPages ??
    Math.max(1, Math.ceil((total || 0) / (limit || fallbackLimit || 1)));

  return {
    items,
    total: Number(total) || 0,
    page: Number(page) || fallbackPage,
    limit: Number(limit) || fallbackLimit,
    totalPages: Number(totalPages) || 1,
  };
};

const getTranslationId = (item: Translation) => {
  const rawId = (item as any).id ?? (item as any).translation_id ?? (item as any)._id;
  return rawId;
};

export function TranslationsList() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  useEffect(() => {
    const handle = setTimeout(() => {
      setPagination((prev) => ({ ...prev, page: 1 }));
      setSearchQuery(searchInput.trim());
    }, 400);
    return () => clearTimeout(handle);
  }, [searchInput]);

  useEffect(() => {
    const fetchTranslations = async () => {
      setLoading(true);
      try {
        const response = await translationsApi.paginate({
          page: pagination.page,
          limit: pagination.limit,
          search: searchQuery || undefined,
        });
        const normalized = normalizePagination(
          response.data,
          pagination.page,
          pagination.limit
        );
        const totalPages = Math.max(1, normalized.totalPages);

        if (pagination.page > totalPages) {
          setPagination((prev) => ({ ...prev, page: totalPages }));
          return;
        }

        setTranslations(normalized.items as Translation[]);
        setPagination({
          total: normalized.total,
          page: normalized.page,
          limit: normalized.limit,
          totalPages,
        });
      } catch (error) {
        toast.error('Failed to fetch translations');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTranslations();
  }, [pagination.page, pagination.limit, searchQuery]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await translationsApi.delete(deleteId);
      toast.success('Translation deleted successfully');
      setTranslations((prev) =>
        prev.filter((item) => {
          const itemId = getTranslationId(item) ?? item.key;
          return String(itemId) !== String(deleteId);
        })
      );
      setPagination((prev) => {
        const nextTotal = Math.max(0, prev.total - 1);
        const nextTotalPages = Math.max(1, Math.ceil(nextTotal / prev.limit));
        const nextPage = Math.min(prev.page, nextTotalPages);
        return {
          ...prev,
          total: nextTotal,
          totalPages: nextTotalPages,
          page: nextPage,
        };
      });
    } catch (error) {
      toast.error('Failed to delete translation');
      console.error(error);
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const isEmpty = !loading && translations.length === 0;
  const start = useMemo(
    () => (pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1),
    [pagination.page, pagination.limit, pagination.total]
  );
  const end = useMemo(
    () => Math.min(pagination.page * pagination.limit, pagination.total),
    [pagination.page, pagination.limit, pagination.total]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Translations
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Manage translation keys across Uzbek, Russian, and Kiril (Cyrillic).
          </p>
        </div>
        <Link to={ROUTES.ADMIN.TRANSLATIONS_NEW}>
          <Button className="bg-cyan-600 hover:bg-cyan-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Translation
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by key or translation..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                {['Key', "Uzbek / O'zbek (UZ)", 'Russian / Русский (RU)', 'Kiril / Кирил (KR)', 'Is Active', 'Actions'].map((header) => (
                  <TableHead key={header}>
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {Array.from({ length: 6 }).map((__, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : isEmpty ? (
        <EmptyState
          title="No translations found"
          description="Create your first translation key."
          actionLabel="Add Translation"
          actionHref={ROUTES.ADMIN.TRANSLATIONS_NEW}
        />
      ) : (
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Key
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Uzbek / O'zbek (UZ)
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Russian / Русский (RU)
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Kiril / Кирил (KR)
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Is Active
                </TableHead>
                <TableHead className="text-right text-xs font-bold uppercase tracking-wider text-gray-500">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {translations.map((translation) => {
                const translationId = getTranslationId(translation);
                const routeId = translationId ?? translation.key;
                const encodedRouteId =
                  routeId !== undefined && routeId !== null
                    ? encodeURIComponent(String(routeId))
                    : '';
                const isActive = typeof translation.is_use === 'boolean'
                  ? translation.is_use
                  : Boolean(
                    (translation as any).is_use ??
                    (translation as any).is_active ??
                    (translation as any).active
                  );

                return (
                  <TableRow
                    key={String(translationId ?? translation.key)}
                    className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <TableCell>
                      <span className="font-mono text-sm text-gray-700 dark:text-gray-200">
                        {translation.key}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">
                      {translation.name_uz}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">
                      {translation.name_ru}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">
                      {translation.name_kr}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={isActive
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 bg-gray-50 text-gray-500'}
                      >
                        {isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {encodedRouteId ? (
                          <Link to={ROUTES.ADMIN.TRANSLATIONS_EDIT(encodedRouteId)}>
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4 text-gray-500 hover:text-cyan-600" />
                            </Button>
                          </Link>
                        ) : (
                          <Button variant="ghost" size="icon" disabled>
                            <Pencil className="h-4 w-4 text-gray-300" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (routeId !== undefined && routeId !== null) {
                              setDeleteId(routeId);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {!loading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {start} to {end} of {pagination.total} results
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              disabled={pagination.page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination((prev) => ({
                ...prev,
                page: Math.min(prev.totalPages, prev.page + 1),
              }))}
              disabled={pagination.page === pagination.totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <DeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Translation"
        description="Are you sure you want to delete this translation? This action cannot be undone."
        loading={deleting}
      />
    </div>
  );
}
