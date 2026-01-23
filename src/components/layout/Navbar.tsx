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
import { useAuthContext } from '@/context/AuthContext';


const breadcrumbMap: Record<string, string> = {
  'admin': 'Admin',
  'dashboard': 'Dashboard',
  'our-services': 'Our Services',
  'reviews': 'Reviews',
  'distributors': 'Distributors',
  'our-projects': 'Our Projects',
  'translations': 'Translations',
  'new': 'Create New',
  'edit': 'Edit',
};

export function Navbar() {
  const { logout } = useAuthContext();
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
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-md px-4 lg:px-6 dark:border-gray-800 dark:bg-gray-950/80">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm overflow-x-auto lg:ml-0 ml-12">
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.path} className="flex items-center gap-1">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
            )}
            {crumb.isLast ? (
              <span className="font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                {crumb.label}
              </span>
            ) : (
              <Link
                to={crumb.path}
                className="text-gray-400 hover:text-primary transition-colors whitespace-nowrap font-medium"
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
        <Button variant="ghost" size="icon" className="relative h-9 w-9 text-gray-400 hover:text-primary transition-colors">
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-primary" />
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2.5 px-1.5 h-9 hover:bg-transparent group">
              <Avatar className="h-8 w-8 ring-1 ring-gray-100 transition-all group-hover:ring-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  A
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:block text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">Admin</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={logout}>
              Logout
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
