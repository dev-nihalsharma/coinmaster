import { CategoryBadgeProps, TransactionTableProps } from '@/types';
import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn, formatAmount, formatDateTime, getTransactionStatus, removeSpecialCharacters } from '@/lib/utils';
import { transactionCategoryStyles } from '@/constants';

const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  const { backgroundColor, borderColor, chipBackgroundColor, textColor } =
    transactionCategoryStyles[category as keyof typeof transactionCategoryStyles];

  return (
    <div className={cn('category-badge', chipBackgroundColor, borderColor)}>
      <div className={cn('size-2 rounded-full', backgroundColor)} />
      <p className={cn('text-[12px] font-medium', textColor)}> {category}</p>
    </div>
  );
};

const TransactionTable = ({ transactions }: TransactionTableProps) => {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className='px-2'>Transaction</TableHead>
          <TableHead className='px-2'>Amount</TableHead>
          <TableHead className='px-2'>Status</TableHead>
          <TableHead className='px-2'>Data</TableHead>
          <TableHead className='px-2 max-md:hidden'>Channel</TableHead>
          <TableHead className='px-2 max-md:hidden'>Category</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((t) => {
          const status = getTransactionStatus(new Date(t.date));
          const ammount = formatAmount(t.amount);
          const isDebit = t.type === 'debit';

          return (
            <TableRow
              key={t.id}
              className={`${
                isDebit || ammount[0] === '-' ? 'bg-[#FFFBFA]' : 'bg-[#F6FEF9]'
              } !over:bg-none !border-b-DEFAULT`}
            >
              <TableCell className='max-w-[250px] pl-2 pr-10'>
                <h1 className='text-14 truncate font-semibold text-[#344054] align-middle'>
                  {removeSpecialCharacters(t.name)}
                </h1>
              </TableCell>
              <TableCell
                className={`pl-2 pr-10 font-semibold ${
                  isDebit || ammount[0] === '-' ? 'text-[#f04438]' : 'text-[#039855]'
                }`}
              >
                {isDebit || ammount[0] === '-' ? `-${ammount}` : `+${ammount}`}
              </TableCell>

              <TableCell className='pl-2 pr-10'>
                <CategoryBadge category={status} />
              </TableCell>
              <TableCell className='pl-2 pr-10 min-w-32'>
                {formatDateTime(new Date(t.date)).dateTime}
              </TableCell>
              <TableCell className='pl-2 pr-10 capitalize min-w-24'>{t.paymentChannel}</TableCell>
              <TableCell className='pl-2 pr-10 capitalize min-w-24'>
                <CategoryBadge category={t.category} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default TransactionTable;
