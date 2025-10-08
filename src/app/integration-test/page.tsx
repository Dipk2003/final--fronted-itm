import IntegrationTest from '@/components/IntegrationTest';

export const metadata = {
  title: 'ITM Integration Test - Frontend-Backend Connection',
  description: 'Test and verify the integration between Next.js frontend and Spring Boot backend',
};

export default function IntegrationTestPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <IntegrationTest />
    </div>
  );
}
