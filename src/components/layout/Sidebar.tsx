import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Wrench,
  MessageSquare,
  Building2,
  FolderKanban,
  ChevronLeft,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/constants';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navigation = [
  { name: 'Dashboard', href: ROUTES.ADMIN.DASHBOARD, icon: LayoutDashboard },
  { name: 'Our Services', href: ROUTES.ADMIN.SERVICES, icon: Wrench },
  { name: 'Reviews', href: ROUTES.ADMIN.REVIEWS, icon: MessageSquare },
  { name: 'Distributors', href: ROUTES.ADMIN.DISTRIBUTORS, icon: Building2 },
  { name: 'Our Projects', href: ROUTES.ADMIN.PROJECTS, icon: FolderKanban },
];

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-64 transform bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out dark:bg-gray-900 dark:border-gray-800',
          'lg:translate-x-0 lg:static lg:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-800">
          <Link to={ROUTES.ADMIN.DASHBOARD} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500 text-white font-bold">
              T
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              Tim Admin
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onToggle}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href ||
              (item.href !== ROUTES.ADMIN.DASHBOARD && location.pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
                )}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    onToggle();
                  }
                }}
              >
                <item.icon className={cn(
                  'h-5 w-5',
                  isActive ? 'text-cyan-600 dark:text-cyan-400' : ''
                )} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © 2024 Tim.uz Admin
          </p>
        </div>
      </aside>

      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'fixed left-4 top-4 z-30 lg:hidden',
          isOpen && 'hidden'
        )}
        onClick={onToggle}
      >
        <Menu className="h-5 w-5" />
      </Button>
    </>
  );
}
