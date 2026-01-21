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
          'fixed left-0 top-0 z-50 h-full w-60 transform bg-white border-r border-gray-100 transition-all duration-300 ease-in-out dark:bg-gray-900 dark:border-gray-800 shadow-sm',
          'lg:translate-x-0 lg:static lg:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-gray-100 px-6 dark:border-gray-800">
          <Link to={ROUTES.ADMIN.DASHBOARD} className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold transition-transform group-hover:scale-105">
              T
            </div>
            <span className="text-base font-bold tracking-tight text-gray-900 dark:text-white">
              TIM ADMIN
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
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 group',
                  isActive
                    ? 'bg-primary/10 text-primary dark:bg-primary/20 shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
                )}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    onToggle();
                  }
                }}
              >
                <item.icon className={cn(
                  'h-4.5 w-4.5 transition-transform group-hover:scale-110',
                  isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'
                )} strokeWidth={isActive ? 2 : 1.5} />
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
