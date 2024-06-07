import AuthForm from '@/components/AuthForm';
import React from 'react';

const SignUp = () => {
  return (
    <section className='flex-center max-sm:px-6 size-full'>
      <AuthForm type={'sign-up'} />
    </section>
  );
};

export default SignUp;
