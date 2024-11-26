// Dashboard.tsx
import Typography from '@/components/Typography';
import SentimentForm from './components/SentimentForm';

export default function Dashboard() {
  return (
    <main className='min-h-screen p-5'>
      <div className='w-full'>
        <Typography variant='h1' weight='black' className='text-center'>
          SENTIMENT ANALYSIS
        </Typography>
      </div>
      <div className='mt-8 flex w-full flex-col items-center justify-center gap-4'>
        <div
          className='ease duration-[0.25s] relative box-border flex h-auto w-full max-w-lg flex-col overflow-hidden
          rounded-lg border-[transparent] bg-[hsla(0,0%,100%,0.05)] p-6 shadow-[0_4px_6px_rgba(0,0,0,0.1)] outline-none
          backdrop-blur-lg backdrop-saturate-[1.8] transition-[transform,_background] pt-16'
        >
          <SentimentForm />
        </div>
      </div>
      <div className='w-full'></div>
    </main>
  );
}
