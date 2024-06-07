'use client';
import React from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import Image from 'next/image';
import Link from 'next/link';
import { sidebarLinks } from '@/constants';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { MobileNavProps } from '@/types';
import SidebarFooter from './SidebarFooter';

const MobileNav = ({ user }: MobileNavProps) => {
  const pathname = usePathname();
  return (
    <section className='w-full w-max-[264px]'>
      <Sheet>
        <SheetTrigger>
          <Image src={'/icons/hamburger.svg'} alt='Menu' width={30} height={30} />
        </SheetTrigger>
        <SheetContent side={'left'} className='border-none bg-white'>
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
          <div className='mobilenav-sheet'>
            <SheetClose asChild>
              {/* close the sheet when clicked anywhere which is not link */}
              <nav className='flex h-full flex-col gap-6 pt-16 text-white'>
                {sidebarLinks.map((item) => {
                  const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
                  return (
                    <Link
                      href={item.route}
                      key={item.label}
                      className={cn('mobilenav-sheet_close', { 'bg-bank-gradient': isActive })}
                    >
                      <Image
                        src={item.imgURL}
                        alt={item.label}
                        width={20}
                        height={20}
                        className={cn({ 'brightness-[3] invert-0': isActive })}
                      />

                      <p className={cn('font-semibold text-16 text-black-2', { 'text-white': isActive })}>
                        {item.label}
                      </p>
                    </Link>
                  );
                })}
              </nav>
              <SidebarFooter user={user} type='mobile' />
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
