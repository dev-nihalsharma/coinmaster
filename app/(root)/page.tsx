import HeaderBox from '@/components/HeaderBox';
import RecentTransactions from '@/components/RecentTransactions';
import RightSideBar from '@/components/RightSideBar';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { plaidClient } from '@/lib/plaid';
import { SearchParamProps, User } from '@/types';
import { redirect } from 'next/navigation';

const Home = async ({ searchParams: { id, page } }: SearchParamProps, user: User) => {
  const currentPage = Number(page as string) || 1;
  const authenticatedUser = await getLoggedInUser();
  const accounts = await getAccounts({ userId: authenticatedUser?.$id! });

  const appwriteItemId = (id as string) || accounts?.data[0]?.appwriteItemId;

  const account = await getAccount({ appwriteItemId });

  if (!authenticatedUser) redirect('/sign-in');
  if (!accounts) redirect('/sign-in');

  return (
    <section className='home'>
      <div className='home-content'>
        <header className='home-header'>
          <HeaderBox
            type='greeting'
            title='Welcome'
            subtext='Access and manage your account & transactions efficiently'
            user={authenticatedUser?.firstname || 'Guest'}
          />

          <TotalBalanceBox
            accounts={accounts?.data}
            totalBanks={accounts?.totalBanks}
            totalCurrentBalance={accounts?.totalCurrentBalance}
          />
        </header>
        <RecentTransactions
          transactions={account.transactions}
          accounts={accounts.data}
          appwriteItemId={appwriteItemId}
          page={currentPage}
        />
      </div>
      <RightSideBar
        user={authenticatedUser!}
        banks={accounts?.data.slice(0, 2)}
        transactions={account.transactions}
      />
    </section>
  );
};

export default Home;
