'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Network } from 'vis-network';
import { Badge } from '@/components/ui/badge';
import { FormProvider, useForm } from 'react-hook-form';
import Button from '@/components/buttons/Button';
import Input from '@/components/form/Input';

interface Node {
  id: string;
  label: string;
}

interface Edge {
  from: string;
  to: string;
}

export default function SentimentGraphPage() {
  const [nodes, setNodes] = useState<Node[]>([]); // Node untuk graf
  const [edges, setEdges] = useState<Edge[]>([]); // Edge untuk graf
  const [sentiment, setSentiment] = useState<string | null>(null); // Sentimen analisis
  const [error, setError] = useState<string | null>(null);
  const networkContainer = useRef<HTMLDivElement | null>(null);
  const methods = useForm({
    mode: 'onTouched',
  });
  const { handleSubmit } = methods;

  // Fungsi untuk menghasilkan sentimen acak
  const generateRandomSentiment = (): string => {
    const sentiments = ['Positive', 'Negative', 'Neutral'];
    return sentiments[Math.floor(Math.random() * sentiments.length)];
  };

  useEffect(() => {
    if (networkContainer.current && nodes.length > 0) {
      const network = new Network(
        networkContainer.current,
        {
          nodes: nodes.map((node) => ({ id: node.id, label: node.label })),
          edges: edges.map((edge) => ({
            from: edge.from,
            to: edge.to,
          })),
        },
        {
          nodes: {
            shape: 'dot',
            size: 20,
            color: '#0074D9',
            font: {
              color: '#000000', // Ubah warna teks label menjadi hitam
              size: 14, // Sesuaikan ukuran font jika diperlukan
            },
          },
          edges: {
            color: '#FF4136',
            arrows: {
              to: {
                enabled: true,
                scaleFactor: 1,
              },
            },
          },
          layout: {
            hierarchical: false,
          },
          physics: {
            enabled: true,
          },
        },
      );

      // Tambahkan interaktivitas jika diperlukan
      network.on('click', (event) => {
        console.log('Node or edge clicked:', event);
      });
    }
  }, [nodes, edges]);

  // Fungsi untuk menangani submit form
  const onSubmit = (data: any) => {
    const inputText = data.kalimat;

    if (!inputText.trim()) {
      setError('Teks tidak boleh kosong!');
      return;
    }

    setError(null); // Reset error jika valid
    const words = Array.from(
      new Set(inputText.trim().split(/\s+/)),
    ) as string[]; // Kata unik dari teks
    const letterId = 'letter'; // ID node untuk teks lengkap

    // Node teks lengkap
    const newNodes: Node[] = [{ id: letterId, label: inputText }];

    // Node kata unik
    newNodes.push(
      ...words.map((word: string, index: number) => ({
        id: `word-${index}`,
        label: word,
      })),
    );

    // Edge dari setiap kata ke teks lengkap
    const newEdges: Edge[] = words.map((_, index: number) => ({
      from: `word-${index}`,
      to: letterId,
    }));

    // Set nodes dan edges
    setNodes(newNodes);
    setEdges(newEdges);

    // Hasilkan sentimen acak
    const randomSentiment = generateRandomSentiment();
    setSentiment(randomSentiment);

    // Log semua label node
    console.log(
      'Nodes:',
      newNodes.map((node) => node.label),
    );
  };

  return (
    <div className='mx-auto w-full max-w-6xl space-y-8'>
      <h1 className='text-center text-3xl font-bold'>
        Sentiment & Graph Visualizer
      </h1>

      <FormProvider {...methods}>
        {/* Form Input */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='mx-auto w-full max-w-xl space-y-4'
        >
          <Input
            id='kalimat'
            className='w-full rounded-lg border-2 border-blue-400 p-2 placeholder:font-normal'
            placeholder='Masukkan teks untuk analisis sentimen'
            validation={{
              required: 'Teks tidak boleh kosong!',
            }}
          />
          <div className='mt-4 flex w-full justify-end'>
            <Button type='submit' variant='success'>
              Analisis & Visualisasi
            </Button>
          </div>
        </form>

        {/* Error Handling */}
        {error && <p className='text-center text-red-500'>{error}</p>}

        {/* Badge Sentimen */}
        {sentiment && (
          <div className='mt-6 text-center'>
            <Badge variant='outline' className='text-lg'>
              Sentimen: {sentiment}
            </Badge>
          </div>
        )}
      </FormProvider>

      {/* Container untuk Vis Network */}
      <div
        ref={networkContainer}
        style={{ width: '100%', height: '500px', border: '1px solid #ddd' }}
      />
    </div>
  );
}
