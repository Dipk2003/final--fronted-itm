import React from "react";

const PharmaMenu = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-3 lg:gap-4 xl:gap-6">
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Common Disease <br /> Medicines
        </h3>
        <ul className="space-y-1">
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Tablets</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Medicines</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Syrup</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Injectables</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Capsules</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Cough Syrup</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Ointments</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Skin Ointment</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Injectable Products</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Eye Drops</a></li>
        </ul>
      </div>
      
      {/* Ayurvedic,Herbal Products & Medicine */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Ayurvedic,Herbal Products<br /> & Medicine
        </h3>
        <ul className="space-y-1">
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Herbal Syrups</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Ayurvedic Medicines</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Ayurvedic Tablets</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Ayurvedic Medicine</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Herb Capsule</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Herbal Capsules</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Areca Nut</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Betel Nuts</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Herbal Tablets</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Ayurvedic Churna</a></li>
        </ul>
      </div>
      
      {/* Nutraceuticals & Dietary Supplements */}
      <div className="space-y-2 hidden md:block">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Nutraceuticals & <br />Dietary Supplements
        </h3>
        <ul className="space-y-1">
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Nutritional Supplements</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Weight Gain Nutrition</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Protein Powder</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Tablet</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Syrup</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Capsules</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Dexorange Syrup</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Coenzyme Q10</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Calcium Tablet</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Whey Protein</a></li>
        </ul>
      </div>
      
      {/* Anti Infective Drugs & Medicines */}
      <div className="space-y-2 hidden md:block">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Anti Infective<br />Drugs & Medicines
        </h3>
        <ul className="space-y-1">
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Hydroxychloroquine Sulphate</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Chloroquine Phosphate</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Antifungal Cream</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Azithromycin Tablets</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Tenofovir Tablet</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Anti HIV Drugs</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Antiretroviral Drug</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Itraconazole Medicine</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Anti Infective Agent</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Cefixime</a></li>
        </ul>
      </div>
      
      {/* Cardiovascular Drugs & Medication */}
      <div className="space-y-2 hidden lg:block">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Cardiovascular<br />Drugs & Medication
        </h3>
        <ul className="space-y-1">
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Erythropoietin Injection</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Insulin Pen</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Metformin Tablets</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Antidiabetic Medicine</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Enoxaparin Injection</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Darbepoetin Alfa Injection</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Mephentermine Sulphate Injection</a></li>
          <li><a href="/Medicines" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Metformin Hydrochloride</a></li>
        </ul>
      </div>
    </div>
  );
};

export default PharmaMenu;
