'use Client';
import { PlaidLinkProps } from '@/types';
import React, { useCallback, useEffect, useState } from 'react';
import { Button } from './ui/button';
import { PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink } from 'react-plaid-link';
import { useRouter } from 'next/navigation';
import { createLinkToken, exchangePublicToken } from '@/lib/actions/user.actions';
import Image from 'next/image';

const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
  const [token, setToken] = useState('');
  const router = useRouter();

  useEffect(() => {
    const getLinkToken = async () => {
      const data = await createLinkToken(user);
      setToken(data?.linkToken);
    };

    getLinkToken();
  }, [user]);

  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (public_token: string) => {
      await exchangePublicToken({
        publicToken: public_token,
        user,
      });

      router.push('/');
    },
    [user, router]
  );

  const config: PlaidLinkOptions = {
    token,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);
  return (
    <>
      {variant === 'primary' ? (
        <Button className='plaidlink-primary' onClick={() => open()} disabled={!ready}>
          Connect Bank
        </Button>
      ) : variant === 'ghost' ? (
        <Button onClick={() => open()} disabled={!ready} className='plaidlink-ghost'>
          Connect Bank
        </Button>
      ) : (
        <Button onClick={() => open()} disabled={!ready} className='plaidlink-default'>
          <Image src='/icons/connect-bank.svg' alt='connect bank' width={24} height={24} />
          <p className='hidden text-[16px] font-semibold text-black-2 xl:block'>Connect Bank</p>
        </Button>
      )}
      ;
    </>
  );
};

export default PlaidLink;
