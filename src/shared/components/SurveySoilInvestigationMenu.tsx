import React from "react";

const SurveySoilInvestigationMenu = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-3 lg:gap-4 xl:gap-6">
      {/* Geotechnical Engineering */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Geotechnical Engineering
        </h3>
        <ul className="space-y-1">
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Geotechnical Investigation Services</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Soil Investigation</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Soil Resistivity Testing Service</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Hydro Geological Study</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Geophysical Survey Services</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Earth Pit Testing</a></li>
        </ul>
      </div>
      
      {/* Land Survey */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Land Survey
        </h3>
        <ul className="space-y-1">
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Levelling Survey</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Geographic Information Systems</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Digital Mapping Service</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Topographic Mapping Services</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Site Survey Services</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">GPS Survey</a></li>
        </ul>
      </div>
      
      {/* Drone Survey */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Drone Survey
        </h3>
        <ul className="space-y-1">
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Aerial Survey</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Solar Thermal Inspection</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Drone Videographic</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Aerial Photography</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Drone 3D Mapping</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Asset Monitoring by Drone</a></li>
        </ul>
      </div>
      
      {/* Property Survey */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Property Survey
        </h3>
        <ul className="space-y-1">
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">City Survey Services</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Property Survey</a></li>
        </ul>
      </div>
      
      {/* Bathymetric Survey */}
      <div className="space-y-2 hidden md:block">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Bathymetric Survey
        </h3>
        <ul className="space-y-1">
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Bathymetric Survey</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Rever Bed Level Survey</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Multi-beam survey</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Hydrological Survey</a></li>
        </ul>
      </div>
      
      {/* GIS Mapping */}
      <div className="space-y-2 hidden lg:block">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          GIS Mapping
        </h3>
        <ul className="space-y-1">
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Cadastral Surveys Services</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Remote Sensing Services</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">GIS Consulting Services</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Digital Mapping</a></li>
        </ul>
      </div>
    </div>
  );
};

export default SurveySoilInvestigationMenu;
