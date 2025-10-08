import React from "react";

const ApparelMenu = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-3 lg:gap-4 xl:gap-6">
      {/* Men's Clothing */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Men's Clothing
        </h3>
        <ul className="space-y-1">
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">T-Shirts</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Casual Shirts</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Formal Shirts</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Jeans</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Trousers</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Suits & Blazers</a></li>
        </ul>
      </div>
      
      {/* Women's Clothing */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Women's Clothing
        </h3>
        <ul className="space-y-1">
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Kurtas & Suits</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Sarees</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Dress Material</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Lehenga Choli</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Blouses</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Tops & Tunics</a></li>
        </ul>
      </div>
      
      {/* Kids Clothing */}
      <div className="space-y-2 hidden md:block">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Kids Clothing
        </h3>
        <ul className="space-y-1">
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">T-Shirts</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Shirts</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Jeans</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Trousers & Pants</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Clothing Sets</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Ethnic Wear</a></li>
        </ul>
      </div>
      
      {/* Footwear */}
      <div className="space-y-2 hidden md:block">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Footwear
        </h3>
        <ul className="space-y-1">
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Men's Footwear</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Women's Footwear</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Kids Footwear</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Sandals</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Flip-Flops</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Boots</a></li>
        </ul>
      </div>
    </div>
  );
};

export default ApparelMenu;

