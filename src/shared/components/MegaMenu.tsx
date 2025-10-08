'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Image, { StaticImageData } from 'next/image';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

// Enhanced styles for perfect dropdown positioning without cutoff
const megaMenuStyles = `
  .megamenu-dropdown {
    box-sizing: border-box !important;
    min-width: 900px !important;
    max-width: calc(100vw - 80px) !important;
    position: absolute !important;
  }
  
  .megamenu-dropdown.left-aligned {
    left: 0 !important;
    transform: none !important;
  }
  
  .megamenu-dropdown.right-aligned {
    right: 0 !important;
    left: auto !important;
    transform: none !important;
  }
  
  .megamenu-dropdown.center-aligned {
    left: 50% !important;
    transform: translateX(-50%) !important;
  }
  
  @media (max-width: 1400px) {
    .megamenu-dropdown {
      min-width: 80vw !important;
      max-width: calc(100vw - 60px) !important;
    }
  }
  
  @media (max-width: 1200px) {
    .megamenu-dropdown {
      min-width: 85vw !important;
      max-width: calc(100vw - 40px) !important;
    }
  }
  
  @media (max-width: 768px) {
    .megamenu-dropdown {
      min-width: 92vw !important;
      max-width: calc(100vw - 16px) !important;
    }
  }
  
  @media (max-width: 480px) {
    .megamenu-dropdown {
      min-width: 95vw !important;
      max-width: calc(100vw - 10px) !important;
    }
  }
`;

// Inject styles only once
if (typeof document !== 'undefined' && !document.querySelector('#megamenu-styles')) {
  const styleElement = document.createElement('style');
  styleElement.id = 'megamenu-styles';
  styleElement.textContent = megaMenuStyles;
  document.head.appendChild(styleElement);
}

// Category Icons - Import actual uploaded images
import mm1 from '@/assets/MegaMenu/mm1.png';
import mm2 from '@/assets/MegaMenu/mm2.png';
import mm3 from '@/assets/MegaMenu/mm3.png';
import mm4 from '@/assets/MegaMenu/mm4.png';
import mm5 from '@/assets/MegaMenu/mm5.png';
import mm6 from '@/assets/MegaMenu/mm6.png';

// Category Components
import PropertiesRealEstateMenu from './PropertiesRealEstateMenu';
import SurveySoilInvestigationMenu from './SurveySoilInvestigationMenu';
import EngineeringServicesMenu from './EngineeringServicesMenu';
import ArchitectureInteriorsMenu from './ArchitectureInteriorsMenu';
import BuildingConstructionMenu from './BuildingConstructionMenu';
import AgricultureMenu from './AgricultureMenu';
import ElectronicsMenu from './ElectronicsMenu';
import ElectricalEquipmentMenu from './ElectricalEquipmentMenu';
import RDTestingLabsMenu from './RDTestingLabsMenu';
import BusinessAuditMenu from './BusinessAuditMenu';
import HandMachineMenu from './HandMachineMenu';
import IndustrialPlantMachineryMenu from './IndustrialPlantMachineryMenu';
import IndustrialSuppliesMenu from './IndustrialSuppliesMenu';
import MechanicalPartsMenu from './MechanicalPartsMenu';
import ProductRentalMenu from './ProductRentalMenu';
import PharmaMenu from './PharmaMenu';
import AutomobileMenu from './AutomobileMenu';
import ApparelMenu from './ApparelMenu';
import ChemicalsDyesSolventsMenu from './ChemicalsDyesSolventsMenu';
import FoodBeveragesMenu from './FoodBeveragesMenu';
import LabInstrumentsSuppliesMenu from './LabInstrumentsSuppliesMenu';
import PackagingMachinesGoodsMenu from './PackagingMachinesGoodsMenu';

interface MenuCategory {
  id: string;
  title: string;
  icon: StaticImageData;
  component: React.ComponentType;
  description?: string;
  itemCount?: number;
}

const menuData: MenuCategory[] = [
  {
    id: 'building-construction',
    title: 'Building & Construction',
    icon: mm1,
    component: BuildingConstructionMenu,
    description: 'Construction Materials & Building Products',
    itemCount: 250,
  },
  {
    id: 'agriculture',
    title: 'Agriculture & Farming',
    icon: mm2,
    component: AgricultureMenu,
    description: 'Seeds, Fertilizers & Farm Equipment',
    itemCount: 120,
  },
  {
    id: 'electrical-equipment',
    title: 'Electrical Equipment',
    icon: mm3,
    component: ElectricalEquipmentMenu,
    description: 'Industrial Electrical & Power Equipment',
    itemCount: 180,
  },
  {
    id: 'electronics-electrical',
    title: 'Electronics & Electrical',
    icon: mm4,
    component: ElectronicsMenu,
    description: 'Consumer Electronics & Home Appliances',
    itemCount: 320,
  },
  {
    id: 'rd-testing-labs',
    title: 'R&D and Testing Labs',
    icon: mm5,
    component: RDTestingLabsMenu,
    description: 'Laboratory Equipment & Testing Services',
    itemCount: 150,
  },
  {
    id: 'business-audit',
    title: 'Business & Audit Services',
    icon: mm6,
    component: BusinessAuditMenu,
    description: 'Audit, Accounting & Compliance Services',
    itemCount: 90,
  },
 
];

const extendedCategories: MenuCategory[] = [
  ...menuData,

   {
    id: 'hand-tools-machinery',
    title: 'Hand Tools & Machines',
    icon: mm1,
    component: HandMachineMenu,
    description: 'Tools for Manual & Machine Work',
    itemCount: 200,
  },
  {
    id: 'industrial-plant-machinery',
    title: 'Industrial Plants & Machinery',
    icon: mm2,
    component: IndustrialPlantMachineryMenu,
    description: 'Heavy Machinery & Manufacturing Equipment',
    itemCount: 275,
  },
  {
    id: 'survey-soil-investigation',
    title: 'Survey & Soil Investigation',
    icon: mm3,
    component: SurveySoilInvestigationMenu,
    description: 'Geotechnical, Land Survey & Drone Services',
    itemCount: 200,
  },
  {
    id: 'engineering-services',
    title: 'Engineering Services',
    icon: mm4,
    component: EngineeringServicesMenu,
    description: 'Industrial Fabrication & Engineering Solutions',
    itemCount: 300,
  },
  {
    id: 'properties-real-estate',
    title: 'Properties & Real Estate',
    icon: mm5,
    component: PropertiesRealEstateMenu,
    description: 'Residential, Commercial & Industrial Properties',
    itemCount: 150,
  },
  {
    id: 'architecture-interiors',
    title: 'Architecture & Interiors',
    icon: mm6,
    component: ArchitectureInteriorsMenu,
    description: 'Interior Design & Architectural Services',
    itemCount: 180,
  },
  {
    id: 'product-rental',
    title: 'Product Rental Services',
    icon: mm1,
    component: ProductRentalMenu,
    description: 'Industrial & Commercial Product Rentals',
    itemCount: 100,
  },
  {
    id: 'industrial-supplies',
    title: 'Industrial Supplies',
    icon: mm2,
    component: IndustrialSuppliesMenu,
    description: 'Raw Materials, Supplies & Consumables',
    itemCount: 290,
  },
  {
    id: 'mechanical-parts',
    title: 'Mechanical Parts',
    icon: mm3,
    component: MechanicalPartsMenu,
    description: 'Precision Components & Mechanical Systems',
    itemCount: 240,
  },
  {
    id: 'pharma-medical',
    title: 'Pharma & Medical',
    icon: mm4,
    component: PharmaMenu,
    description: 'Pharmaceutical Products & Medical Equipment',
    itemCount: 180,
  },
  {
    id: 'automobile-automotive',
    title: 'Automobile & Automotive',
    icon: mm5,
    component: AutomobileMenu,
    description: 'Auto Parts, Accessories & Vehicle Services',
    itemCount: 220,
  },
  {
    id: 'apparel-fashion',
    title: 'Apparel & Fashion',
    icon: mm6,
    component: ApparelMenu,
    description: 'Clothing, Textiles & Fashion Accessories',
    itemCount: 160,
  },
  {
    id: 'chemicals-dyes-solvents',
    title: 'Chemicals, Dyes & Solvents',
    icon: mm1,
    component: ChemicalsDyesSolventsMenu,
    description: 'Industrial Chemicals & Chemical Solutions',
    itemCount: 210,
  },
  {
    id: 'food-beverages',
    title: 'Food & Beverages',
    icon: mm2,
    component: FoodBeveragesMenu,
    description: 'Food Products, Beverages & Food Processing',
    itemCount: 140,
  },
  {
    id: 'lab-instruments-supplies',
    title: 'Lab Instruments & Supplies',
    icon: mm3,
    component: LabInstrumentsSuppliesMenu,
    description: 'Laboratory Equipment & Scientific Instruments',
    itemCount: 190,
  },
  {
    id: 'packaging-machines-goods',
    title: 'Packaging Machines & Goods',
    icon: mm4,
    component: PackagingMachinesGoodsMenu,
    description: 'Packaging Equipment & Materials',
    itemCount: 170,
  }
];

const MegaMenu: React.FC = () => {
  const router = useRouter();
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [categories, setCategories] = useState(
    menuData.map(cat => ({ ...cat, isExpanded: false }))
  );
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [dropdownSides, setDropdownSides] = useState<Record<string, 'left' | 'center' | 'right'>>({});

  const totalProducts = useMemo(
    () => extendedCategories.reduce((sum, cat) => sum + (cat.itemCount || 0), 0),
    []
  );

  const updateDropdownSide = (categoryId: string, index: number) => {
    const container = containerRefs.current[index];
    if (container) {
      const rect = container.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const dropdownWidth = Math.min(1400, Math.max(900, viewportWidth * 0.85)); // Dynamic dropdown width
      const padding = 40; // Increased padding from edges

      let side: 'left' | 'center' | 'right' = 'center';
      
      // Calculate if dropdown would overflow on left or right
      const centerLeft = rect.left + rect.width / 2 - dropdownWidth / 2;
      const centerRight = rect.left + rect.width / 2 + dropdownWidth / 2;
      
      // More aggressive edge detection
      if (centerLeft < padding || rect.left < dropdownWidth / 3) {
        side = 'left';
      } else if (centerRight > viewportWidth - padding || rect.right > viewportWidth - dropdownWidth / 3) {
        side = 'right';
      }

      setDropdownSides(prev => ({ ...prev, [categoryId]: side }));
    }
  };

  const handleMouseEnter = (categoryId: string, index: number) => {
    updateDropdownSide(categoryId, index);
    setCategories(prev =>
      prev.map(cat => ({ ...cat, isExpanded: cat.id === categoryId }))
    );
  };

  const handleMouseLeave = () => {
    setCategories(prev => prev.map(cat => ({ ...cat, isExpanded: false })));
  };

  const handleViewAllClick = () => {
    setShowAllCategories(prev => !prev);
    const newSet = showAllCategories ? menuData : extendedCategories;
    setCategories(newSet.map(cat => ({ ...cat, isExpanded: false })));
  };

  return (
    <div className="relative">
      <section className="w-full bg-gradient-to-br from-blue-50 to-indigo-100 py-12 relative overflow-x-hidden" onMouseLeave={handleMouseLeave}>
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover thousands of products from verified suppliers across India's top business categories
            </p>
          </div>

          <div className={`transition-all duration-300 ${categories.some(cat => cat.isExpanded) ? 'mb-[500px]' : 'mb-0'}`}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 lg:gap-8 relative z-10">
              {categories.map((category, idx) => {
                const CategoryComponent = category.component;
                const isActive = category.isExpanded;
                const dropdownSide = dropdownSides[category.id] || 'center';

                const dropdownPositionClass = 
                  dropdownSide === 'left'
                    ? 'left-aligned'
                    : dropdownSide === 'right'
                      ? 'right-aligned'
                      : 'center-aligned';

                const arrowPositionClass = 
                  dropdownSide === 'left'
                    ? 'left-10'
                    : dropdownSide === 'right'
                      ? 'right-10'
                      : 'left-1/2 -translate-x-1/2';

                return (
                  <div 
                    key={category.id} 
                    ref={el => { containerRefs.current[idx] = el; }}
                    className="group relative h-full" 
                    onMouseEnter={() => handleMouseEnter(category.id, idx)}
                  >
                    <button
                      className={`megamenu-card flex flex-col items-center justify-between w-full h-full min-h-[180px] p-4 rounded-xl bg-white shadow-md hover:shadow-lg border border-gray-100 ${isActive ? 'border-indigo-200 shadow-lg' : 'hover:border-indigo-200'}`}
                    >
                      <div className="flex flex-col items-center space-y-3 w-full">
                        <div className="relative">
                          <div className="w-14 h-14 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-full flex items-center justify-center">
                            <Image src={category.icon} alt={category.title} width={48} height={48} />
                          </div>
                          {isActive && <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full animate-pulse" />}
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900">{category.title}</h3>
                        {category.description && <p className="text-xs text-gray-500 text-center">{category.description}</p>}
                        {category.itemCount && <span className="text-xs text-indigo-600">{category.itemCount}+ items</span>}
                      </div>
                      <ChevronDownIcon className={`w-4 h-4 mt-2 ${isActive ? 'rotate-180' : ''}`} />
                    </button>

                    {isActive && (
                      <div className={`megamenu-dropdown top-full z-[9999] mt-2 ${dropdownPositionClass}`}>
                        <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
                          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-100">
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="text-xl font-bold flex items-center gap-3 text-gray-800">
                                  <Image src={category.icon} alt="" width={24} height={24} className="w-6 h-6" />
                                  {category.title}
                                </h3>
                                {category.description && <p className="text-sm text-gray-600 mt-2">{category.description}</p>}
                              </div>
                              <button className="text-indigo-600 font-semibold hover:text-indigo-800 hover:underline text-sm transition-colors duration-200">
                                View All →
                              </button>
                            </div>
                          </div>
                          <div className="p-6 max-h-[450px] overflow-y-auto bg-gray-50/30">
                            <CategoryComponent />
                          </div>
                        </div>
                        <div className={`absolute -top-2 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45 ${arrowPositionClass} z-[10000]`} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {!categories.some(cat => cat.isExpanded) && (
            <div className="text-center mt-12">
              <button onClick={handleViewAllClick} className="group inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg hover:shadow-xl hover:scale-105 transition">
                <span className="mr-2">{showAllCategories ? 'Show Less' : 'View All Categories'}</span>
                <ChevronDownIcon className={`w-5 h-5 ${showAllCategories ? 'rotate-180' : 'group-hover:rotate-90'} transition`} />
              </button>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="p-4 bg-white rounded-lg shadow text-indigo-600 text-center">
                  <div className="text-2xl font-bold">{extendedCategories.length}</div>
                  <div className="text-sm">Total Categories</div>
                </div>
                <div className="p-4 bg-white rounded-lg shadow text-indigo-600 text-center">
                  <div className="text-2xl font-bold">{totalProducts.toLocaleString()}+</div>
                  <div className="text-sm">Products Available</div>
                </div>
                <div className="p-4 bg-white rounded-lg shadow text-indigo-600 text-center">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-sm">Support</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MegaMenu;
