// SentimentForm.tsx
'use client';

import Button from '@/components/buttons/Button';
import Input from '@/components/form/Input';
import { Badge } from '@/components/ui/badge';
import * as react from 'react';
import { FormProvider, useForm } from 'react-hook-form';

export default function SentimentForm() {
  const [isAnswer, setIsAnswer] = react.useState<boolean>(false); // Memperbaiki set state
  const [sentiment, setSentiment] = react.useState<string | null>(null); // Menyimpan hasil sentimen
  const methods = useForm({
    mode: 'onTouched',
  });
  const { handleSubmit } = methods;

  // Fungsi untuk menangani submit form
  const onSubmit = (data: any) => {
    setIsAnswer(true);
    console.log('Form submitted:', data);
    // Placeholder untuk logika analisis sentimen
    setSentiment('Neutral'); // Hasil analisis sementara
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          id='kalimat'
          className='w-full rounded-lg border-2 border-blue-400 p-2 placeholder:font-normal'
          placeholder='Masukkan Kalimat'
          validation={{
            required: 'Kalimat tidak boleh kosong!',
          }}
        />
        <div className='mt-4 flex w-full justify-end'>
          <Button type='submit' variant='success'>
            Cek Sentimen!
          </Button>
        </div>
      </form>

      {isAnswer && (
        <Badge variant='outline' className='absolute right-6 top-6 w-fit'>
          {sentiment}
        </Badge>
      )}
    </FormProvider>
  );
}
