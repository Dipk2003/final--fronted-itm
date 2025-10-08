'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { Menu } from 'lucide-react';

// Import category menu components
import AgricultureMenu from './AgricultureMenu';
import ApparelMenu from './ApparelMenu';
import ArchitectureInteriorsMenu from './ArchitectureInteriorsMenu';
import AutomobileMenu from './AutomobileMenu';
import BuildingConstructionMenu from './BuildingConstructionMenu';
import BusinessAuditMenu from './BusinessAuditMenu';
import ChemicalsDyesSolventsMenu from './ChemicalsDyesSolventsMenu';
import ElectricalEquipmentMenu from './ElectricalEquipmentMenu';
import ElectronicsMenu from './ElectronicsMenu';
import EngineeringServicesMenu from './EngineeringServicesMenu';
import FoodBeveragesMenu from './FoodBeveragesMenu';
import HandMachineMenu from './HandMachineMenu';
import IndustrialPlantMachineryMenu from './IndustrialPlantMachineryMenu';
import IndustrialSuppliesMenu from './IndustrialSuppliesMenu';
import LabInstrumentsSuppliesMenu from './LabInstrumentsSuppliesMenu';
import MechanicalPartsMenu from './MechanicalPartsMenu';
import PackagingMachinesGoodsMenu from './PackagingMachinesGoodsMenu';
import PharmaMenu from './PharmaMenu';
import ProductRentalMenu from './ProductRentalMenu';
import PropertiesRealEstateMenu from './PropertiesRealEstateMenu';
import RDTestingLabsMenu from './RDTestingLabsMenu';
import SurveySoilInvestigationMenu from './SurveySoilInvestigationMenu';

// Import icons
import mm1 from '@/assets/MegaMenu/mm1.png';
import mm2 from '@/assets/MegaMenu/mm2.png';
import mm3 from '@/assets/MegaMenu/mm3.png';
import mm4 from '@/assets/MegaMenu/mm4.png';
import mm5 from '@/assets/MegaMenu/mm5.png';
import mm6 from '@/assets/MegaMenu/mm6.png';

interface Category {
  id: string;
  title: string;
  icon: any;
  component: React.ComponentType;
  description: string;
  itemCount: number;
}

const categories: Category[] = [
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
    id: 'electronics',
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
  {
    id: 'automobile',
    title: 'Automobile & Automotive',
    icon: mm1,
    component: AutomobileMenu,
    description: 'Auto Parts, Accessories & Vehicle Services',
    itemCount: 220,
  },
  {
    id: 'chemicals',
    title: 'Chemicals, Dyes & Solvents',
    icon: mm2,
    component: ChemicalsDyesSolventsMenu,
    description: 'Industrial Chemicals & Chemical Solutions',
    itemCount: 210,
  },
  {
    id: 'food-beverages',
    title: 'Food & Beverages',
    icon: mm3,
    component: FoodBeveragesMenu,
    description: 'Food Products, Beverages & Food Processing',
    itemCount: 140,
  },
  {
    id: 'pharma',
    title: 'Pharma & Medical',
    icon: mm4,
    component: PharmaMenu,
    description: 'Pharmaceutical Products & Medical Equipment',
    itemCount: 180,
  },
  {
    id: 'industrial-supplies',
    title: 'Industrial Supplies',
    icon: mm5,
    component: IndustrialSuppliesMenu,
    description: 'Raw Materials, Supplies & Consumables',
    itemCount: 290,
  },
  {
    id: 'mechanical-parts',
    title: 'Mechanical Parts',
    icon: mm6,
    component: MechanicalPartsMenu,
    description: 'Precision Components & Mechanical Systems',
    itemCount: 240,
  },
];

interface MegaMenuContentProps {
  onClose: () => void;
}

const MegaMenuContent: React.FC<MegaMenuContentProps> = ({ onClose }) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const router = useRouter();

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/categories/${categoryId}`);
    onClose();
  };

  const handleViewAllCategories = () => {
    router.push('/categories');
    onClose();
  };

  const ActiveComponent = hoveredCategory 
    ? categories.find(cat => cat.id === hoveredCategory)?.component 
    : null;

  return (
    <div className="flex bg-white shadow-xl border-t border-gray-200">
      {/* Categories List */}
      <div className="w-1/3 bg-gray-50 border-r border-gray-200">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600">
          <h3 className="text-lg font-semibold text-white">Browse Categories</h3>
          <p className="text-blue-100 text-sm mt-1">Discover thousands of products</p>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              onMouseEnter={() => setHoveredCategory(category.id)}
              className={`w-full text-left p-3 border-b border-gray-100 hover:bg-blue-50 transition-colors group ${
                hoveredCategory === category.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                    <Image 
                      src={category.icon} 
                      alt={category.title} 
                      width={20} 
                      height={20}
                      className="w-5 h-5"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm group-hover:text-blue-600">
                      {category.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {category.itemCount}+ items
                    </div>
                  </div>
                </div>
                <ChevronRightIcon className={`w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors ${
                  hoveredCategory === category.id ? 'text-blue-500' : ''
                }`} />
              </div>
            </button>
          ))}
          
          {/* View All Categories Button */}
          <button
            onClick={handleViewAllCategories}
            className="w-full p-4 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all font-medium"
          >
            View All Categories →
          </button>
        </div>
      </div>

      {/* Category Details */}
      <div className="w-2/3 bg-white">
        {hoveredCategory && ActiveComponent ? (
          <div className="p-6">
            <div className="mb-4">
              <div className="flex items-center space-x-3 mb-2">
                <Image 
                  src={categories.find(cat => cat.id === hoveredCategory)?.icon} 
                  alt="" 
                  width={24} 
                  height={24}
                  className="w-6 h-6"
                />
                <h4 className="text-xl font-bold text-gray-900">
                  {categories.find(cat => cat.id === hoveredCategory)?.title}
                </h4>
              </div>
              <p className="text-gray-600 text-sm">
                {categories.find(cat => cat.id === hoveredCategory)?.description}
              </p>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              <ActiveComponent />
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Menu className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Browse Categories
            </h4>
            <p className="text-gray-600 text-sm mb-6">
              Hover over a category to explore subcategories and products
            </p>
            
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {categories.length}+
                </div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {categories.reduce((sum, cat) => sum + cat.itemCount, 0).toLocaleString()}+
                </div>
                <div className="text-sm text-gray-600">Products</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MegaMenuContent;
