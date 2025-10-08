import React from "react";

const EngineeringServicesMenu = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-3 lg:gap-4 xl:gap-6">
      {/* Industrial Fabrication */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Industrial Fabrication
        </h3>
        <ul className="space-y-1">
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Steel Fabrication</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Metal Fabrication</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Structural Work</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Welding Services</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Heavy Engineering</a></li>
        </ul>
      </div>
      
      {/* Metal Finishing */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Metal Finishing
        </h3>
        <ul className="space-y-1">
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Powder Coating</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Electroplating</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Anodizing</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Polishing</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Galvanizing</a></li>
        </ul>
      </div>
      
      {/* Manufacturing Services */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Manufacturing Services
        </h3>
        <ul className="space-y-1">
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">CNC Machining</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Sheet Metal Work</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Precision Engineering</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Tool & Die Making</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Assembly Services</a></li>
        </ul>
      </div>
      
      {/* Design & Consulting */}
      <div className="space-y-2 hidden md:block">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Design & Consulting
        </h3>
        <ul className="space-y-1">
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">CAD Design</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">3D Modeling</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Engineering Consulting</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Project Management</a></li>
        </ul>
      </div>
      
      {/* Testing & Quality */}
      <div className="space-y-2 hidden lg:block">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Testing & Quality
        </h3>
        <ul className="space-y-1">
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Material Testing</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">NDT Services</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Quality Control</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Inspection Services</a></li>
        </ul>
      </div>
    </div>
  );
};

export default EngineeringServicesMenu;
