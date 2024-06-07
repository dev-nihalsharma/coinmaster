'use client';

import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React from 'react';
import { Sidebar } from 'lucide-react';
import SidebarFooter from './SidebarFooter';
import PlaidLink from './PlaidLink';

const SideBar = ({ user }: any) => {
  const pathname = usePathname();
  return (
    <section className='sidebar'>
      <nav className='flex flex-col gap-4'>
        <Link href='/' className='mb-12 cursor-pointer items-center gap-2'>
          <div className='flex gap-2 items-center'>
            <Image
              src={'/icons/logo.svg'}
              width={34}
              height={34}
              alt='Coin Master'
              className='size-[24px] max-xl:size-14'
            />
            <h1 className='sidebar-logo'>Coin Master</h1>
          </div>
        </Link>
        {sidebarLinks.map((item) => {
          const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);

          return (
            <Link
              href={item.route}
              key={item.label}
              className={cn('sidebar-link', { 'bg-bank-gradient': isActive })}
            >
              <div className='relative size-6'>
                <Image
                  src={item.imgURL}
                  alt={item.label}
                  fill
                  className={cn({ 'brightness-[3] invert-0': isActive })}
                />
              </div>
              <p className={cn('sidebar-label', { '!text-white': isActive })}>{item.label}</p>
            </Link>
          );
        })}
        <PlaidLink user={user} />
      </nav>
      <SidebarFooter user={user} type='desktop' />
    </section>
  );
};

export default SideBar;
