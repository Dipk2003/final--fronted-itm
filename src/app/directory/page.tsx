import { DirectoryPage } from '@/modules/directory';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Business Directory - Find Service Providers | Indian Trade Mart',
  description: 'Find and connect with trusted service providers, businesses, and professionals in your area. Search by service type, location, and ratings.',
  keywords: 'business directory, service providers, professionals, suppliers, contractors, consultants, local businesses',
  openGraph: {
    title: 'Business Directory - Find Service Providers | Indian Trade Mart',
    description: 'Find and connect with trusted service providers, businesses, and professionals in your area.',
    type: 'website',
  },
};

interface DirectoryPageProps {
  searchParams: Promise<{
    q?: string;
    location?: string;
    category?: string;
  }>;
}

export default async function Directory({ searchParams }: DirectoryPageProps) {
  const resolvedSearchParams = await searchParams;
  return (
    <DirectoryPage
      initialQuery={resolvedSearchParams.q || ''}
      initialLocation={resolvedSearchParams.location || ''}
      initialCategory={resolvedSearchParams.category || ''}
    />
  );
}
