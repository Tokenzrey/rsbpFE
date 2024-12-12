'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Network } from 'vis-network';
import { Badge } from '@/components/ui/badge';
import { FormProvider, useForm } from 'react-hook-form';
import Button from '@/components/buttons/Button';
import Input from '@/components/form/Input';
import axios from 'axios';

interface Node {
  id: string;
  label: string;
}

interface Edge {
  from: string;
  to: string;
  weight: string;
}

export default function SentimentGraphPage() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [sentiment, setSentiment] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const networkContainer = useRef<HTMLDivElement | null>(null);
  const methods = useForm({
    mode: 'onTouched',
  });
  const { handleSubmit } = methods;

  useEffect(() => {
    if (networkContainer.current && nodes.length > 0) {
      const network = new Network(
        networkContainer.current,
        {
          nodes: nodes.map((node) => ({ id: node.id, label: node.label })),
          edges: edges.map((edge) => ({
            from: edge.from,
            to: edge.to,
            label: edge.weight, // Display the weight above the edge
            font: {
              align: 'top', // Align the weight above the edge
            },
          })),
        },
        {
          nodes: {
            shape: 'dot',
            size: 20,
            color: '#0074D9',
            font: {
              color: '#000000',
              size: 14,
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
            font: {
              align: 'horizontal',
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

      network.on('click', (event) => {
        console.log('Node or edge clicked:', event);
      });
    }
  }, [nodes, edges]);

  const onSubmit = async (data: any) => {
    const inputText = data.kalimat;

    if (!inputText.trim()) {
      setError('Teks tidak boleh kosong!');
      return;
    }

    setError(null);

    try {
      // Fetch graph data from /build_graph/
      const graphResponse = await axios.post(
        'http://localhost:8000/build_graph/',
        {
          sentence: inputText,
        },
      );
      const graphData = graphResponse.data;

      // Parse nodes and edges from API response
      const newNodes: Node[] = Object.entries(graphData.nodes).map(
        ([key, value]: any) => ({
          id: key,
          label: value.label,
        }),
      );

      const newEdges: Edge[] = graphData.edges.map((edge: any) => ({
        from: edge.source,
        to: edge.target,
        weight: edge.weight.toFixed(2), // Format weight to 2 decimal places
      }));

      setNodes(newNodes);
      setEdges(newEdges);

      // Fetch sentiment from /predict_sentiment/
      const sentimentResponse = await axios.post(
        'http://localhost:8000/predict_sentiment/',
        {
          sentence: inputText,
        },
      );
      setSentiment(sentimentResponse.data.predicted_sentiment);
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan saat memproses permintaan.');
    }
  };

  return (
    <div className='mx-auto w-full max-w-6xl space-y-8'>
      <h1 className='text-center text-3xl font-bold'>
        Sentiment & Graph Visualizer
      </h1>

      <FormProvider {...methods}>
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

        {error && <p className='text-center text-red-500'>{error}</p>}

        {sentiment && (
          <div className='mt-6 text-center'>
            <Badge variant='outline' className='text-lg'>
              Sentimen: {sentiment}
            </Badge>
          </div>
        )}
      </FormProvider>

      <div
        ref={networkContainer}
        style={{ width: '100%', height: '500px', border: '1px solid #ddd' }}
      />
    </div>
  );
}
