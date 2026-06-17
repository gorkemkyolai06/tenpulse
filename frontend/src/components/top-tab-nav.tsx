'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CircleDot,
  GraduationCap,
  Cog,
  CalendarClock,
  Scissors,
  Tags,
  Settings,
  Sun,
  Moon,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', label: 'Panel', icon: LayoutDashboard },
  { href: '/courts', label: 'Kortlar', icon: CircleDot },
  { href: '/lesson-sessions', label: 'Ders Oturumları', icon: GraduationCap },
  { href: '/ball-machine-maintenance', label: 'Top Makinesi', icon: Cog },
  { href: '/court-maintenance', label: 'Kort Bakımı', icon: CalendarClock },
  { href: '/stringing-orders', label: 'Kordon', icon: Scissors },
  { href: '/rate-tiers', label: 'Fiyat Kademeleri', icon: Tags },
  { href: '/settings', label: 'Ayarlar', icon: Settings },
];

export function TopTabNav() {
  const pathname = usePathname();
  const { tennisClub, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-navy text-chalk clay-nav-border">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 lg:px-6">
        <Link href="/dashboard" className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center bg-accent text-accent-foreground">
            <CircleDot className="h-5 w-5" strokeWidth={2} />
          </div>
          <div className="hidden sm:block">
            <p className="font-display text-sm font-bold leading-tight text-chalk">TenPulse</p>
            <p className="truncate text-xs text-chalk/60">{tennisClub?.name || 'Tenis Tesisi'}</p>
          </div>
        </Link>

        <nav className="flex flex-1 items-center gap-0.5 overflow-x-auto" aria-label="Ana menü">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 px-2.5 py-2 text-xs font-medium transition-colors sm:text-sm',
                  active
                    ? 'border-b-2 border-accent bg-accent/15 text-accent'
                    : 'border-b-2 border-transparent text-chalk/70 hover:bg-chalk/10 hover:text-chalk',
                )}
                aria-current={active ? 'page' : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={active ? 2.25 : 1.75} />
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1">
          {user && (
            <span className="mr-1 hidden text-xs text-chalk/60 xl:inline">
              {user.firstName} {user.lastName}
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-8 w-8 text-chalk/70 hover:bg-chalk/10 hover:text-chalk"
            aria-label="Tema değiştir"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="h-8 w-8 text-chalk/70 hover:bg-destructive/20 hover:text-destructive-foreground"
            aria-label="Çıkış yap"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
