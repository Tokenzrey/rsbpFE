'use client';

import Button from '@/components/buttons/Button';
import Input from '@/components/form/Input';
import { Badge } from '@/components/ui/badge';
import * as react from 'react';
import { FormProvider, useForm } from 'react-hook-form';

export default function SentimentForm() {
  const [isAnswer, setIsAnswer] = react.useState<boolean>(false); 
  const [sentiment, setSentiment] = react.useState<string | null>(null); 
  const methods = useForm({
    mode: 'onTouched',
  });
  const { handleSubmit } = methods;

  // Fungsi untuk menghasilkan sentimen acak
  const generateRandomSentiment = (): string => {
    const sentiments = ['Positive', 'Negative', 'Neutral']; 
    return sentiments[Math.floor(Math.random() * sentiments.length)];
  };

  // Fungsi untuk menangani submit form
  const onSubmit = (data: any) => {
    setIsAnswer(true);
    console.log('Form submitted:', data);
    const randomSentiment = generateRandomSentiment(); 
    setSentiment(randomSentiment); 
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='w-full max-w-md mx-auto space-y-4'
      >
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

      {isAnswer && sentiment && (
        <div className='mt-6'>
          <Badge variant='outline' className='w-full text-center'>
            Sentimen: {sentiment}
          </Badge>
        </div>
      )}
    </FormProvider>
  );
}
