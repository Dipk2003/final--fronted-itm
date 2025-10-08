import { DirectoryPage } from '@/modules/directory';
import { Metadata } from 'next';

interface CityDirectoryPageProps {
  params: Promise<{
    city: string;
  }>;
  searchParams: Promise<{
    category?: string;
    service?: string;
  }>;
}

export async function generateMetadata({ params, searchParams }: CityDirectoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const cityName = decodeURIComponent(resolvedParams.city).replace(/-/g, ' ');
  const service = resolvedSearchParams.service || resolvedSearchParams.category;
  
  const title = service 
    ? `${service} in ${cityName} - Service Providers | Indian Trade Mart`
    : `Service Providers in ${cityName} | Indian Trade Mart`;
    
  const description = service
    ? `Find trusted ${service.toLowerCase()} service providers in ${cityName}. Compare ratings, reviews, and get quotes.`
    : `Find trusted service providers and businesses in ${cityName}. Compare ratings, reviews, and connect with local professionals.`;

  return {
    title,
    description,
    keywords: `${service || 'service providers'}, ${cityName}, local businesses, professionals, suppliers`,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}

export default async function CityDirectoryPage({ params, searchParams }: CityDirectoryPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const cityName = decodeURIComponent(resolvedParams.city).replace(/-/g, ' ');
  const service = resolvedSearchParams.service || resolvedSearchParams.category || '';

  return (
    <DirectoryPage
      initialQuery={service}
      initialLocation={cityName}
      initialCategory={resolvedSearchParams.category}
    />
  );
}
