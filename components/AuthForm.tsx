'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { authFormSchema } from '@/lib/utils';
import { AuthFormProps } from '@/types';
import CustomInput from './CustomInput';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from '@/lib/actions/user.actions';
import PlaidLink from './PlaidLink';

const AuthForm = ({ type }: AuthFormProps) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      address1: '',
      state: '',
      postalCode: '',
      dateOfBirth: '',
      ssn: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      console.log('type');
      console.log(data);
      if (type === 'sign-in') {
        const res = await signIn(data);

        if (res) router.push('/');
      }
      if (type === 'sign-up') {
        const userData = {
          firstName: data.firstName!,
          lastName: data.lastName!,
          address1: data.address1!,
          city: data.city!,
          state: data.state!,
          postalCode: data.postalCode!,
          dateOfBirth: data.dateOfBirth!,
          ssn: data.ssn!,
          email: data.email,
          password: data.password,
        };

        console.log(userData);
        const res = await signUp(userData);
        console.log(res);
        setUser(res);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className='auth-form'>
      <header className='flex flex-col  '>
        <Link href='/' className='mb-12 cursor-pointer items-center gap-2'>
          <div className='flex gap-2 items-center'>
            <Image src={'/icons/logo.svg'} width={34} height={34} alt='Coin Master' className='size-10' />
            <h1 className='text-[28px] font-ibm-plex-serif text-black-1 font-bold '>Coin Master</h1>
          </div>
        </Link>
        <div className='flex flex-col gap-1 md:gap-3'>
          <h1 className='text-24 font-semibold lg:text-36 text-gray-900'>
            {user ? 'Link Account' : type == 'sign-in' ? 'Log in' : 'Sign up'}{' '}
          </h1>
          <p className='text-16 font-normal text-gray-600'>
            {user
              ? 'Link your account to get started'
              : type == 'sign-in'
              ? 'Welcome back! Please enter your details.'
              : 'Please enter your details'}
          </p>
        </div>
      </header>
      {user ? (
        <div className='flex flex-col gap-4'>
          <PlaidLink user={user} variant='primary' />
        </div>
      ) : (
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              {type == 'sign-up' && (
                <>
                  <div className='flex gap-4'>
                    <CustomInput
                      control={form.control}
                      name='firstName'
                      label='First Name'
                      placeholder='ex: John'
                    />
                    <CustomInput
                      control={form.control}
                      name='lastName'
                      label='Last Name'
                      placeholder='ex: Doe'
                    />
                  </div>
                  <CustomInput
                    control={form.control}
                    name='address'
                    label='Address'
                    placeholder='Enter your specific address'
                  />
                  <CustomInput
                    control={form.control}
                    name='city'
                    label='City'
                    placeholder='Enter your City'
                  />
                  <div className='flex gap-4'>
                    <CustomInput control={form.control} name='state' label='State' placeholder='ex: NY' />
                    <CustomInput
                      control={form.control}
                      name='postalCode'
                      label='Postal Code'
                      placeholder='ex: 11101'
                    />
                  </div>
                  <div className='flex gap-4'>
                    <CustomInput
                      control={form.control}
                      name='dob'
                      label='Date of Birth'
                      placeholder='yyyy-mm-dd'
                    />
                    <CustomInput control={form.control} name='ssn' label='SSN' placeholder='ex: 1234' />
                  </div>
                </>
              )}
              <CustomInput control={form.control} name='email' label='Email' placeholder='Enter your email' />
              <CustomInput
                control={form.control}
                name='password'
                label='Password'
                placeholder='Enter your password'
              />

              <div className='flex flex-col gap-4'>
                <Button className='form-btn' disabled={isLoading} type='submit'>
                  {isLoading ? (
                    <Loader2 size={20} className='animate-spin' />
                  ) : type === 'sign-in' ? (
                    'Login'
                  ) : (
                    'Sign Up'
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <footer className='flex justify-center items-center gap-1 mt-6'>
            <p className='text-16 font-normal text-gray-600'>
              {type === 'sign-in' ? 'Don’t have an account?' : 'Already have an account?'}
            </p>
            <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'} className='form-link'>
              {type === 'sign-in' ? 'Sign up' : 'Log in'}
            </Link>
          </footer>
        </div>
      )}
    </section>
  );
};

export default AuthForm;
