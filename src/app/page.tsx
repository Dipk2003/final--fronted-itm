import { 
  HeroBanner, 
  CategoryGrid, 
  ProductGrid, 
  CTASection, 
  PremiumBrands, 
  TopCities 
} from '@/shared/components'

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <CategoryGrid />
      <ProductGrid />
      <TopCities />
      <PremiumBrands/>
      <CTASection />
    </>
  )
}
