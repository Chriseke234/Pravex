'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Landmark, Send, CreditCard, Menu } from 'lucide-react';
import { useUiStore } from '@/store/ui-store';
import { cn } from '@/lib/utils';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { openSidebar } = useUiStore();

  const navItems = [
    {
      label: 'Home',
      icon: LayoutDashboard,
      href: '/dashboard',
      isActive: pathname === '/dashboard',
    },
    {
      label: 'Accounts',
      icon: Landmark,
      href: '/dashboard/accounts',
      isActive: pathname === '/dashboard/accounts',
    },
    {
      label: 'Transfers',
      icon: Send,
      href: '/dashboard/transfers',
      isCenterAction: true,
      isActive: pathname === '/dashboard/transfers',
    },
    {
      label: 'Cards',
      icon: CreditCard,
      href: '/dashboard/cards',
      isActive: pathname === '/dashboard/cards',
    },
  ];

  return (
    <nav aria-label='Mobile bottom navigation' className='lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-1.5 shadow-[0_-8px_30px_rgba(0,0,0,0.6)]'>
      <div className='max-w-md mx-auto flex items-center justify-around relative'>
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.isCenterAction) {
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                className='flex flex-col items-center group -mt-5 relative z-10'
              >
                <div
                  className={cn(
                    'w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 active:scale-95',
                    item.isActive
                      ? 'bg-amber-500 text-slate-950 shadow-amber-500/40 ring-4 ring-slate-950'
                      : 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 shadow-amber-500/30 hover:shadow-amber-500/50 ring-4 ring-slate-950'
                  )}
                >
                  <Icon className='w-5 h-5' strokeWidth={2.5} />
                </div>
                <span className='text-[10px] font-bold text-amber-400 mt-1'>
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 active:scale-95',
                item.isActive
                  ? 'text-amber-400 font-semibold'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              <div className='relative'>
                <Icon
                  className={cn(
                    'w-5 h-5 transition-transform duration-200',
                    item.isActive && 'scale-110'
                  )}
                  strokeWidth={item.isActive ? 2.2 : 1.8}
                />
                {item.isActive && (
                  <span className='absolute -top-1 -right-1 w-1.5 h-1.5 bg-amber-400 rounded-full shadow-[0_0_8px_#f59e0b]' />
                )}
              </div>
              <span className='text-[10px] tracking-tight mt-1 truncate'>
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Menu / Full Sidebar Drawer Button */}
        <button
          onClick={openSidebar}
          aria-label='Open navigation menu'
          className='flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-400 hover:text-white transition-all duration-200 active:scale-95 focus:outline-none'
        >
          <Menu className='w-5 h-5' strokeWidth={1.8} />
          <span className='text-[10px] tracking-tight mt-1 truncate'>
            Menu
          </span>
        </button>
      </div>
    </nav>
  );
}
