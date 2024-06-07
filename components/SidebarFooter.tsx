import { logoutUser } from '@/lib/actions/user.actions';
import { FooterProps } from '@/types';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/router';
import React from 'react';

const SidebarFooter = ({ user, type }: FooterProps) => {
  const handleLogut = async () => {
    const isLoggedOut = await logoutUser();

    if (isLoggedOut) redirect('/sign-in');
  };
  return (
    <footer className='footer'>
      <div className={type == 'desktop' ? 'footer_name' : 'footer_name-mobile'}>
        <p className='font-bold text-gray-700 text-xl'>{user?.firstName[0]}</p>
      </div>

      <div className={type == 'desktop' ? 'footer_email' : 'footer_email-mobile'}>
        <h1 className='text-14 font-semibold text-gray-700'>
          {user?.firstName} {user?.lastName}
        </h1>
        <p className='text-14 font-normal text-gray-600'>{user?.email}</p>
      </div>

      <div className='footer_image'>
        <Image src={'/icons/logout.svg'} fill alt='Logout' onClick={handleLogut} />
      </div>
    </footer>
  );
};

export default SidebarFooter;
