'use server';

import {
  SignUpParams,
  User,
  createBankAccountProps,
  exchangePublicTokenProps,
  getBankByAccountIdProps,
  getBankProps,
  getBanksProps,
  getUserInfoProps,
  signInProps,
} from '@/types';
import { createAdminClient, createSessionClient } from '../appwrite';
import { cookies } from 'next/headers';
import { ID, Query } from 'node-appwrite';
import { encryptId, extractCustomerIdFromUrl, parseStringify } from '../utils';
import {
  CountryCode,
  ProcessorTokenCreateRequest,
  ProcessorTokenCreateRequestProcessorEnum,
  Products,
} from 'plaid';
import { plaidClient } from '../plaid';
import { revalidatePath } from 'next/cache';
import { addFundingSource, createDwollaCustomer } from './dwolla.actions';

const { APPWRITE_DATABASE_ID, APPWRITE_USER_COLLECTION_ID, APPWRITE_BANK_COLLECTION_ID } = process.env;

const getUserInfo = async ({ userId }: getUserInfoProps) => {
  try {
    const { database } = await createAdminClient();

    const user = await database.getDocument(APPWRITE_DATABASE_ID!, APPWRITE_USER_COLLECTION_ID!, userId);

    return parseStringify(user);
  } catch (error) {
    console.log('Error: ', error);
  }
};

export const signIn = async ({ email, password }: signInProps) => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createEmailPasswordSession(email, password);

    cookies().set('appwrite-session', session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });

    const user = await getUserInfo({ userId: session.userId });

    return parseStringify(user);
  } catch (error) {
    console.log('Error: ', error);
  }
};

export const signUp = async ({ password, ...userData }: SignUpParams) => {
  const { email, firstName, lastName } = userData;

  let newUserAccount;
  try {
    const { account, database } = await createAdminClient();

    newUserAccount = await account.create(ID.unique(), email, password, `${firstName} ${lastName}`);

    if (!newUserAccount) throw new Error('Error creating new user');

    const dwollaCustomerUrl = await createDwollaCustomer({
      ...userData,
      type: 'personal',
    });

    console.log(dwollaCustomerUrl);
    if (!dwollaCustomerUrl) throw new Error('Error creating new dwolla customer');

    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

    const newUser = await database.createDocument(
      APPWRITE_DATABASE_ID!,
      APPWRITE_USER_COLLECTION_ID!,
      ID.unique(),
      {
        ...userData,
        userId: newUserAccount.$id,
        dwollaCustomerId,
        dwollaCustomerUrl,
      }
    );

    const session = await account.createEmailPasswordSession(email, password);

    cookies().set('appwrite-session', session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });

    return parseStringify(newUser);
  } catch (error) {
    console.log('Error: ', error);
  }
};

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const result = await account.get();

    const user = await getUserInfo({ userId: result.$id });

    return parseStringify(user);
  } catch (error) {
    return null;
  }
}

export async function logoutUser() {
  try {
    const { account } = await createSessionClient();

    cookies().delete('appwrite-session');
    await account.deleteSession('current');

    return true;
  } catch (error) {
    return false;
  }
}

export const createLinkToken = async (user: User) => {
  try {
    const tokenParams = {
      user: {
        client_user_id: user.$id,
      },
      client_name: `${user.firstName} ${user.lastName}`,
      products: ['auth'] as Products[],
      country_codes: process.env.PLAID_COUNTRY_CODES?.split(',') as CountryCode[],
      language: 'en',
    };

    const res = await plaidClient.linkTokenCreate(tokenParams);

    return parseStringify({ linkToken: res.data.link_token });
  } catch (error) {
    console.log('Error: ', error);
  }
};

const createBankAccount = async (data: createBankAccountProps) => {
  try {
    const { database } = await createAdminClient();

    const bankAccount = await database.createDocument(
      APPWRITE_DATABASE_ID!,
      APPWRITE_BANK_COLLECTION_ID!,
      ID.unique(),
      data
    );

    return parseStringify(bankAccount);
  } catch (error) {
    console.log('Error: ', error);
  }
};

export const exchangePublicToken = async ({ publicToken, user }: exchangePublicTokenProps) => {
  try {
    const res = await plaidClient.itemPublicTokenExchange({ public_token: publicToken });

    const accessToken = res.data.access_token;
    const itemId = res.data.item_id;

    const accountsResponse = await plaidClient.accountsGet({ access_token: accessToken });

    const accountData = accountsResponse.data.accounts[0];

    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: 'dwollow' as ProcessorTokenCreateRequestProcessorEnum,
    };

    const processorTokenResponse = await plaidClient.processorTokenCreate(request);
    const processorToken = processorTokenResponse.data.processor_token;

    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });

    if (!fundingSourceUrl) throw Error;

    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      shareableId: encryptId(accountData.account_id),
    });

    revalidatePath('/');

    return parseStringify({
      publicTokenExchange: 'complete',
    });
  } catch (error) {
    console.log('Error: ', error);
  }
};

export const getBanks = async ({ userId }: getBanksProps) => {
  try {
    const { database } = await createAdminClient();

    const banks = await database.listDocuments(APPWRITE_DATABASE_ID!, APPWRITE_BANK_COLLECTION_ID!, [
      Query.equal('userId', [userId]),
    ]);

    return parseStringify(banks.documents);
  } catch (error) {
    console.log(error);
  }
};

export const getBank = async ({ documentId }: getBankProps) => {
  try {
    const { database } = await createAdminClient();

    const bank = await database.listDocuments(APPWRITE_DATABASE_ID!, APPWRITE_BANK_COLLECTION_ID!, [
      Query.equal('$id', [documentId]),
    ]);

    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

export const getBankByAccountId = async ({ accountId }: getBankByAccountIdProps) => {
  try {
    const { database } = await createAdminClient();

    const bank = await database.listDocuments(APPWRITE_DATABASE_ID!, APPWRITE_BANK_COLLECTION_ID!, [
      Query.equal('accountId', [accountId]),
    ]);

    if (bank.total !== 1) return null;

    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.log(error);
  }
};
