import AuthForm from '@/components/AuthForm';
import React from 'react';

const SignIn = () => {
  return (
    <section className='flex-center max-sm:px-6 size-full'>
      <AuthForm type={'sign-in'} />
    </section>
  );
};

export default SignIn;
