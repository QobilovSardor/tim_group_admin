import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/common/DataTable';
import { DeleteDialog } from '@/components/common/DeleteDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { projectsApi } from '@/lib/api';
import type { Project } from '@/lib/types';
import type { Column } from '@/components/common/DataTable';
import { toast } from 'sonner';
import { ROUTES } from '@/config/constants';

export function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProjects = async () => {
    try {
      const response = await projectsApi.getAll();
      // Handle both direct array and wrapped { data: [...] } response
      const data = Array.isArray(response.data)
        ? response.data
        : (response.data as any).data || [];
      setProjects(data);
    } catch (error) {
      toast.error('Failed to fetch projects');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;

    setDeleting(true);
    try {
      await projectsApi.delete(deleteId);
      toast.success('Project deleted successfully');
      setProjects((prev) => prev.filter((p) => p.id !== deleteId));
    } catch (error) {
      toast.error('Failed to delete project');
      console.error(error);
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const columns: Column<Project>[] = [
    {
      key: 'img',
      header: 'Image',
      render: (project) => (
        <div className="h-16 w-24 overflow-hidden rounded-md border bg-gray-50">
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Image';
            }}
          />
        </div>
      ),
    },
    {
      key: 'title',
      header: 'Title',
      sortable: true,
      render: (project) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {project.title}
        </span>
      ),
    },
    {
      key: 'link',
      header: 'Link',
      render: (project) => (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-cyan-600 hover:text-cyan-700 hover:underline"
        >
          View Project <ExternalLink className="h-3 w-3" />
        </a>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (project) => (
        <div className="flex items-center justify-end gap-2">
          <Link to={ROUTES.ADMIN.PROJECTS_EDIT(project.id)}>
            <Button variant="ghost" size="icon">
              <Pencil className="h-4 w-4 text-gray-500 hover:text-cyan-600" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteId(project.id)}
          >
            <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  if (!loading && projects.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Our Projects
        </h1>
        <EmptyState
          title="No projects found"
          description=" showcase your work by adding your first project."
          actionLabel="Add Project"
          actionHref={ROUTES.ADMIN.PROJECTS_NEW}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Our Projects
        </h1>
        <Link to={ROUTES.ADMIN.PROJECTS_NEW}>
          <Button className="bg-cyan-600 hover:bg-cyan-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        </Link>
      </div>

      <DataTable
        data={projects}
        columns={columns}
        loading={loading}
        searchKey="title"
        searchPlaceholder="Search projects..."
      />

      <DeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
        loading={deleting}
      />
    </div>
  );
}
