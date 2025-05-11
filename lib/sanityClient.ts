import { createClient } from 'next-sanity';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = '2023-02-01'; // Use a consistent API version
const useCdn = process.env.NODE_ENV === 'production'; // Use CDN in production

if (!projectId || !dataset) {
  throw new Error('Missing Sanity environment variables');
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
});