import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProjectForm } from '@/components/forms/ProjectForm';
import { projectsApi } from '@/lib/api';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import type { Project } from '@/lib/types';
import { ROUTES } from '@/config/constants';

export function EditProject() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    async function fetchProject() {
      if (!id) return;
      try {
        const { data } = await projectsApi.getById(Number(id));
        setProject(data);
      } catch (error) {
        toast.error('Failed to fetch project details');
        navigate(ROUTES.ADMIN.PROJECTS);
      } finally {
        setInitialLoading(false);
      }
    }
    fetchProject();
  }, [id, navigate]);

  const handleSubmit = async (values: any) => {
    if (!id) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('link', values.link);
      if (values.img instanceof File) {
        formData.append('img', values.img);
      }

      await projectsApi.update(Number(id), formData);
      toast.success('Project updated successfully');
      navigate('/admin/our-projects');
    } catch (error) {
      toast.error('Failed to update project');
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
          Edit Project
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Update project details.
        </p>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-800">
        <ProjectForm
          initialData={project}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
}
