import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const breadcrumbMap: Record<string, string> = {
  'admin': 'Admin',
  'dashboard': 'Dashboard',
  'our-services': 'Our Services',
  'reviews': 'Reviews',
  'distributors': 'Distributors',
  'our-projects': 'Our Projects',
  'new': 'Create New',
  'edit': 'Edit',
};

export function Navbar() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  // Build breadcrumbs
  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    const isLast = index === pathSegments.length - 1;
    const isId = /^\d+$/.test(segment);
    const label = isId ? `#${segment}` : breadcrumbMap[segment] || segment;

    return { path, label, isLast };
  });

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white/95 backdrop-blur px-4 lg:px-6 dark:border-gray-800 dark:bg-gray-900/95">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1 text-sm overflow-x-auto lg:ml-0 ml-12">
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.path} className="flex items-center gap-1">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
            )}
            {crumb.isLast ? (
              <span className="font-medium text-gray-900 dark:text-white whitespace-nowrap">
                {crumb.label}
              </span>
            ) : (
              <Link
                to={crumb.path}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 whitespace-nowrap"
              >
                {crumb.label}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-cyan-500" />
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-cyan-100 text-cyan-700 text-sm font-medium">
                  A
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:block text-sm font-medium">Admin</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
