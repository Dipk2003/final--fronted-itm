import { useEffect, useState } from 'react';

export type SubdomainType = 'main' | 'vendor' | 'admin' | 'support' | 'customer';

export interface SubdomainInfo {
  subdomain: SubdomainType;
  isVendor: boolean;
  isAdmin: boolean;
  isSupport: boolean;
  isCustomer: boolean;
  isMain: boolean;
}

export const useSubdomain = (): SubdomainInfo => {
  const [subdomain, setSubdomain] = useState<SubdomainType>('main');
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const parts = hostname.split('.');
      
      if (parts.length > 2) {
        const sub = parts[0];
        switch (sub.toLowerCase()) {
          case 'vendor':
            setSubdomain('vendor');
            break;
          case 'admin':
            setSubdomain('admin');
            break;
          case 'support':
            setSubdomain('support');
            break;
          case 'customer':
            setSubdomain('customer');
            break;
          default:
            setSubdomain('main');
        }
      } else {
        setSubdomain('main');
      }
    }
  }, []);
  
  return {
    subdomain,
    isVendor: subdomain === 'vendor',
    isAdmin: subdomain === 'admin',
    isSupport: subdomain === 'support',
    isCustomer: subdomain === 'customer',
    isMain: subdomain === 'main',
  };
};

export const getSubdomainUrl = (subdomain: SubdomainType): string => {
  const domain = process.env.NEXT_PUBLIC_DOMAIN || 'indiantrademart.com';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const port = process.env.NODE_ENV === 'production' ? '' : ':3000';
  
  if (subdomain === 'main') {
    return `${protocol}://${domain}${port}`;
  }
  
  return `${protocol}://${subdomain}.${domain}${port}`;
};

export const redirectToSubdomain = (subdomain: SubdomainType, path: string = '/') => {
  const url = getSubdomainUrl(subdomain) + path;
  window.location.href = url;
};
