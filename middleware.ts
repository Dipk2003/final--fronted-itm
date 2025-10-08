// middleware.ts (place at project root)
import { NextRequest, NextResponse } from 'next/server';

const ROOT_DOMAIN = process.env.ROOT_DOMAIN || 'indiantrademart.com';
const RESERVED = new Set(['www', 'api', 'admin', 'mail', 'ftp', 'localhost']);

function getHost(req: NextRequest) {
  const host = req.headers.get('host') ?? '';
  return host.split(':')[0].toLowerCase();
}

export function middleware(req: NextRequest) {
  const host = getHost(req);
  if (!host) return NextResponse.next();

  // allow local dev
  if (host === 'localhost' || host.startsWith('127.0.0.1')) return NextResponse.next();

  // handle requests to root domain: optionally redirect certain path -> subdomain
  if (host === ROOT_DOMAIN || host === `www.${ROOT_DOMAIN}`) {
    const parts = req.nextUrl.pathname.split('/').filter(Boolean);
    const first = parts[0]?.toLowerCase();
    // paths on root that you want to send to subdomains
    const known = ['login', 'vendor', 'directory'];
    if (first && known.includes(first)) {
      const redirectUrl = new URL(req.nextUrl.toString());
      redirectUrl.hostname = `${first}.${ROOT_DOMAIN}`;
      // preserve query string and path after first
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }

  // if host is a subdomain of ROOT_DOMAIN -> rewrite to internal route
  if (host.endsWith(`.${ROOT_DOMAIN}`)) {
    const sub = host.replace(`.${ROOT_DOMAIN}`, '').split('.')[0].toLowerCase();
    if (!sub || RESERVED.has(sub)) return NextResponse.next();

    const url = req.nextUrl.clone();
    // If user hits the subdomain root (/) we map commonly used ones:
    if (url.pathname === '/' || url.pathname === '') {
      // vendor subdomain -> vendor login page
      if (sub === 'vendor') {
        url.pathname = `/vendor/login`;
      } else {
        // default: subdomain -> /<subdomain>
        url.pathname = `/${sub}`;
      }
      return NextResponse.rewrite(url);
    }

    // For any other path, prefix with /<subdomain> unless already prefixed
    if (!url.pathname.startsWith(`/${sub}`)) {
      url.pathname = `/${sub}${url.pathname}`;
    }
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

// exclude static assets, images, API, and next internals
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
