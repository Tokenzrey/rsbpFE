import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
} from 'axios';
import { GetServerSidePropsContext } from 'next';
import { ApiSuccess, ApiError } from '@/types/api';

let apiContext: GetServerSidePropsContext | null = null;

/**
 * Set API context untuk SSR (Server-Side Rendering).
 * Harus dipanggil sebelum melakukan request API di server.
 * @param {GetServerSidePropsContext} context - Context dari Next.js (getServerSideProps atau getStaticProps).
 */
export const setApiContext = (context: GetServerSidePropsContext): void => {
  apiContext = context;
};

/**
 * Mendapatkan base URL untuk request API berdasarkan environment (dev/prod).
 * @returns {string} Base URL API.
 * @throws {Error} Jika environment mode tidak diatur.
 */
function getBaseURL() {
  const mode = process.env.NEXT_PUBLIC_RUN_MODE;

  if (mode === 'development') {
    return process.env.NEXT_PUBLIC_API_URL_DEV || '';
  } else if (mode === 'production') {
    return process.env.NEXT_PUBLIC_API_URL_PROD || '';
  } else {
    throw new Error(
      'Environment mode tidak diatur. Periksa NEXT_PUBLIC_RUN_MODE.',
    );
  }
}

/**
 * Membuat instance Axios dengan konfigurasi default.
 */
export const api: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Credentials tidak dikirim secara default.
});

/**
 * Interceptor Response:
 * Menangani response sukses dan mengkustomisasi pesan error.
 */
api.interceptors.response.use(
  (response: AxiosResponse<ApiSuccess>) => response,
  (error: AxiosError<ApiError>) => error,
);

/**
 * Menghapus API context setelah setiap request server-side.
 * Harus dipanggil untuk menghindari context yang tidak valid di request berikutnya.
 */
export const resetApiContext = (): void => {
  apiContext = null;
};

export default api;
