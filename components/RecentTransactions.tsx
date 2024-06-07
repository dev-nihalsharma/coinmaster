import { RecentTransactionsProps } from '@/types';
import Link from 'next/link';
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BankTabItem } from './BankTabItem';
import BankInfo from './BankInfo';
import TransactionTable from './TransactionTable';
import { Pagination } from './Pagination';

const RecentTransactions = ({ accounts, transactions, appwriteItemId, page }: RecentTransactionsProps) => {
  const currentPage = Number(page) || 1;

  const rowsPerPage = Number(process.env.ROWS_PER_PAGE);
  const totalPages = Math.ceil(transactions.length / rowsPerPage);

  const indexOfLastTransaction = currentPage * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  return (
    <section className='recent-transactions'>
      <header className='flex justify-between items-center'>
        <h2 className='recent-transaction-label'>Recent Transactions</h2>
        <Link href={`/transaction-history/?id=${appwriteItemId}`} className='view-all-btn'>
          View All
        </Link>
      </header>

      <Tabs defaultValue={appwriteItemId} className='w-[400px]'>
        <TabsList className='recent-transaction-tablist'>
          {accounts.map((account) => (
            <BankTabItem key={account.id} account={account} appwriteItemId={appwriteItemId} />
          ))}
        </TabsList>
        {accounts.map((account) => (
          <TabsContent key={account.id} value={account.appwriteItemId} className='space-y-4'>
            <BankInfo account={account} appwriteItemId={appwriteItemId} type='full' />

            <TransactionTable transactions={currentTransactions} />

            {totalPages > 1 && (
              <div className='my-4 w-full'>
                <Pagination totalPages={totalPages} page={currentPage} />
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

export default RecentTransactions;
