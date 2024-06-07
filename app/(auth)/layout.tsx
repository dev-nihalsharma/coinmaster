import Image from 'next/image';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex justify-between min-h-screen w-full font-inter'>
      {children}
      <div className='auth-asset'>
        <Image src={'/icons/dashboard.jpg'} alt='Auth Image' width={800} height={1000} />
      </div>
    </div>
  );
}
