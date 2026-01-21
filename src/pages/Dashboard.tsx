import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Wrench,
  MessageSquare,
  Building2,
  FolderKanban,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { servicesApi, reviewsApi, distributorsApi, projectsApi } from '@/lib/api';
import { ROUTES } from '@/config/constants';

interface StatCard {
  title: string;
  value: number;
  icon: React.ReactNode;
  href: string;
  color: string;
}

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    services: 0,
    reviews: 0,
    distributors: 0,
    projects: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [servicesRes, reviewsRes, distributorsRes, projectsRes] = await Promise.all([
          servicesApi.getAll().catch(() => ({ data: [] })),
          reviewsApi.getAll().catch(() => ({ data: [] })),
          distributorsApi.getAll().catch(() => ({ data: [] })),
          projectsApi.getAll().catch(() => ({ data: [] })),
        ]);

        const getCount = (response: any) => {
          const data = response.data;
          if (Array.isArray(data)) return data.length;
          if (data && Array.isArray(data.data)) return data.data.length;
          return 0;
        };

        setStats({
          services: getCount(servicesRes),
          reviews: getCount(reviewsRes),
          distributors: getCount(distributorsRes),
          projects: getCount(projectsRes),
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards: StatCard[] = [
    {
      title: 'Our Services',
      value: stats.services,
      icon: <Wrench className="h-5 w-5" />,
      href: ROUTES.ADMIN.SERVICES,
      color: 'bg-cyan-500',
    },
    {
      title: 'Reviews',
      value: stats.reviews,
      icon: <MessageSquare className="h-5 w-5" />,
      href: ROUTES.ADMIN.REVIEWS,
      color: 'bg-emerald-500',
    },
    {
      title: 'Distributors',
      value: stats.distributors,
      icon: <Building2 className="h-5 w-5" />,
      href: ROUTES.ADMIN.DISTRIBUTORS,
      color: 'bg-purple-500',
    },
    {
      title: 'Our Projects',
      value: stats.projects,
      icon: <FolderKanban className="h-5 w-5" />,
      href: ROUTES.ADMIN.PROJECTS,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Welcome back! Here's an overview of your content.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.title} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {card.title}
              </CardTitle>
              <div className={`${card.color} rounded-lg p-2 text-white`}>
                {card.icon}
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {card.value}
                  </span>
                  <span className="flex items-center text-xs text-emerald-600">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    Active
                  </span>
                </div>
              )}
              <Link to={card.href}>
                <Button variant="ghost" size="sm" className="mt-3 -ml-2 text-cyan-600 hover:text-cyan-700">
                  View all
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Create new content quickly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link to={ROUTES.ADMIN.SERVICES_NEW}>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Wrench className="h-4 w-4 text-cyan-600" />
                Add Service
              </Button>
            </Link>
            <Link to={ROUTES.ADMIN.REVIEWS_NEW}>
              <Button variant="outline" className="w-full justify-start gap-2">
                <MessageSquare className="h-4 w-4 text-emerald-600" />
                Add Review
              </Button>
            </Link>
            <Link to={ROUTES.ADMIN.DISTRIBUTORS_NEW}>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Building2 className="h-4 w-4 text-purple-600" />
                Add Distributor
              </Button>
            </Link>
            <Link to={ROUTES.ADMIN.PROJECTS_NEW}>
              <Button variant="outline" className="w-full justify-start gap-2">
                <FolderKanban className="h-4 w-4 text-orange-600" />
                Add Project
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
