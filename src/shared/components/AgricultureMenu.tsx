import React from "react";

const AgricultureMenu = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-3 lg:gap-4 xl:gap-6">
      {/* Insecticides and Pesticides */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
            
        </h3>
        <ul className="space-y-1">
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Insecticides</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Fungicides</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Herbicides</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Bio Insecticides</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Termiticide</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Plant Growth Regulators</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Rodenticides</a></li>
        </ul>
      </div>
      
      {/* Farming Tools & Equipment */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Farming Tools & Equipment
        </h3>
        <ul className="space-y-1">
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Agricultural Sprayers</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Agricultural Equipment</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Seeding Machine</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Rotavator</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Tiller</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Planter Machine</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Disc Harrow</a></li>
        </ul>
      </div>
      
      {/* Seeds and Plant Saplings */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Seeds & Plant Saplings
        </h3>
        <ul className="space-y-1">
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Vegetable Seeds</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Hybrid Seeds</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Flower Seeds</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Fruit Seeds</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Medicinal Plant Seeds</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Oil Seeds</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Tree Seeds</a></li>
        </ul>
      </div>
      
      {/* Fertilizers & Soil Additives */}
      <div className="space-y-2 hidden md:block">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Fertilizers & Soil Additives
        </h3>
        <ul className="space-y-1">
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Organic Fertilizers</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Nitrogen Fertilizers</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Phosphate Fertilizers</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Bio Fertilizers</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Micronutrient Fertilizers</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Urea</a></li>
        </ul>
      </div>
      
      {/* Tractor & Parts */}
      <div className="space-y-2 hidden lg:block">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Tractor & Parts
        </h3>
        <ul className="space-y-1">
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Tractor</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Tractor Spare Parts</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Tractor Attachments</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Power Tiller</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Harvester</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Cultivator</a></li>
        </ul>
      </div>
      
      {/* Animal Food & Feed */}
      <div className="space-y-2 hidden xl:block">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Animal Food & Feed
        </h3>
        <ul className="space-y-1">
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Animal Feed</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Cattle Feed</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Poultry Feed</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Pet Food</a></li>
          <li><a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors">Fish Foods</a></li>
        </ul>
      </div>
       {/* Chemical Plants & Machinery */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Chemical Plants & Machinery
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Soap Making Machinery</a></li>
          <li><a href="#">Petrochemical Refineries</a></li>
          <li><a href="#">Chemical Pumps</a></li>
          <li><a href="#">Chemical Plant</a></li>
          <li><a href="#">Diaphragm Pumps</a></li>
          <li><a href="#">Distillation Units</a></li>
          <li><a href="#">Resin Manufacturing Plant</a></li>
          <li><a href="#">Chemical Handling Equipment</a></li>
          <li><a href="#">Ointment Manufacturing Plant</a></li>
          <li><a href="#">Mineral Processing Plants</a></li>
          <li><a href="#">Industrial Skid</a></li>
          <li><a href="#">Oilfield Equipment</a></li>
          <li><a href="#">Chemical Machinery Parts</a></li>
        </ul>
      </div>

      {/* Paper Work & Making Machine */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Paper Work & Making Machine
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Disposable Plate Making Machine</a></li>
          <li><a href="#">Cup Making Machine</a></li>
          <li><a href="#">Paper Machinery</a></li>
          <li><a href="#">Corrugating Machine</a></li>
          <li><a href="#">Creasing Machine</a></li>
          <li><a href="#">Paper Machinery Parts</a></li>
        </ul>
      </div>

      {/* Food Processing Plants & Machinery */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Food Processing Plants & Machinery
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Food Processing Machine</a></li>
          <li><a href="#">Wet Grinder</a></li>
          <li><a href="#">Sugarcane Juice Machine & Sugar Mill Machinery</a></li>
          <li><a href="#">Animal Feed Making Machine</a></li>
          <li><a href="#">Food Cutter</a></li>
          <li><a href="#">Coconut Processing Machinery</a></li>
          <li><a href="#">Tilting Paste Kettle</a></li>
          <li><a href="#">Vegetable Cutting Machine</a></li>
          <li><a href="#">Peeling Machine</a></li>
          <li><a href="#">Fruit & Vegetable Washer</a></li>
        </ul>
      </div>

      {/* Wire Drawing & Cabling Machines */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Wire Drawing & Cabling Machines
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Coil Winders</a></li>
          <li><a href="#">Fastener Making Machine</a></li>
          <li><a href="#">Wire Stripping Machinery</a></li>
          <li><a href="#">Electric Cable Making Machine</a></li>
          <li><a href="#">Wire Forming Machine</a></li>
          <li><a href="#">Wire Machinery</a></li>
          <li><a href="#">Chain Link Machine</a></li>
          <li><a href="#">Winding Machines</a></li>
          <li><a href="#">Crimping Machine</a></li>
          <li><a href="#">Wire Drawing Machines</a></li>
          <li><a href="#">Coiling Machines</a></li>
          <li><a href="#">Stranding Machines</a></li>
          <li><a href="#">Cable Machinery</a></li>
          <li><a href="#">Wire Wrapping Machine</a></li>
          <li><a href="#">EDM Wire Cut Machine</a></li>
          <li><a href="#">Annealing Machine</a></li>
        </ul>
      </div>

      {/* Casting, Moulding & Forging Machines */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Casting, Moulding & Forging Machines
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Molding Machines</a></li>
          <li><a href="#">Casting Machines</a></li>
          <li><a href="#">Forging Machinery</a></li>
          <li><a href="#">Die Casting Machines</a></li>
          <li><a href="#">Foundry Machinery</a></li>
          <li><a href="#">Bottle Making Machine</a></li>
        </ul>
      </div>

      {/* Boilers & Boiler Parts */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Boilers & Boiler Parts
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Steam Boilers</a></li>
          <li><a href="#">Boiler</a></li>
          <li><a href="#">Boiler Fittings</a></li>
          <li><a href="#">Industrial Boilers</a></li>
          <li><a href="#">Boiler Burners</a></li>
          <li><a href="#">Boiler Accessories</a></li>
          <li><a href="#">Gas Boiler</a></li>
          <li><a href="#">Boiler Tube</a></li>
          <li><a href="#">Hot Air Generator</a></li>
        </ul>
      </div>

      {/* Industrial Mixers & Homogenizers */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Industrial Mixers & Homogenizers
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Powder Mixers</a></li>
          <li><a href="#">Agitator</a></li>
          <li><a href="#">Industrial Mixers</a></li>
          <li><a href="#">Liquid Mixers</a></li>
          <li><a href="#">Homogenizer</a></li>
          <li><a href="#">Continuous Mixer</a></li>
          <li><a href="#">Batch Mixers</a></li>
          <li><a href="#">Sand Mixer</a></li>
        </ul>
      </div>

      {/* Chemical Reactors and Process Tanks */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Chemical Reactors and Process Tanks
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Septic Tanks</a></li>
          <li><a href="#">Pressure Vessels</a></li>
          <li><a href="#">Chemical Reactors</a></li>
          <li><a href="#">Process Tanks</a></li>
          <li><a href="#">Reaction Vessel</a></li>
          <li><a href="#">Vessel Parts</a></li>
          <li><a href="#">Process Vessels</a></li>
          <li><a href="#">Transport Tanks</a></li>
          <li><a href="#">Air Receiver</a></li>
        </ul>
      </div>
      {/* Vending Machines & Dispensers */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Vending Machines & Dispensers
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Water Dispensers</a></li>
          <li><a href="#">Vending Machine</a></li>
          <li><a href="#">Beverage Dispensers</a></li>
          <li><a href="#">Ice Cream Vending Machine</a></li>
          <li><a href="#">Coffee Machine</a></li>
          <li><a href="#">Beverage Vending Machines</a></li>
          <li><a href="#">Dispensers</a></li>
          <li><a href="#">Vending Machine Part</a></li>
          <li><a href="#">Coffee Vending Machines</a></li>
          <li><a href="#">Espresso Machine</a></li>
          <li><a href="#">Manual Coffee Brewer</a></li>
        </ul>
      </div>

      {/* Used Machinery & Tools */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Used Machinery & Tools
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Used CNC Machine</a></li>
          <li><a href="#">Used Textile Machinery</a></li>
          <li><a href="#">Used Printing Machine</a></li>
          <li><a href="#">Used Machines</a></li>
          <li><a href="#">Refurbished Generator</a></li>
          <li><a href="#">Second Hand and Used Furniture</a></li>
          <li><a href="#">Used Printer</a></li>
          <li><a href="#">Used Electric Motor</a></li>
        </ul>
      </div>

      {/* Pharmaceutical Machinery & Equipment */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Pharmaceutical Machinery & Equipment
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Pharmaceutical Machines</a></li>
          <li><a href="#">Pharmaceutical Processing Equipment</a></li>
          <li><a href="#">Tablet Making Machines</a></li>
          <li><a href="#">Capsule Filling Machines</a></li>
          <li><a href="#">Tablet Testing System</a></li>
          <li><a href="#">Capsule Making Machine</a></li>
          <li><a href="#">Pharmacy Equipment</a></li>
          <li><a href="#">Pharmaceutical Dryers</a></li>
          <li><a href="#">Pharmaceutical Packaging Machines</a></li>
        </ul>
      </div>

      {/* Fruit & Vegetable Processing Machine */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Fruit & Vegetable Processing Machine
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Vegetable Cutting Machine</a></li>
          <li><a href="#">Dehydration Plants & Dryers</a></li>
          <li><a href="#">Peeling Machine</a></li>
          <li><a href="#">Juice Extractor</a></li>
          <li><a href="#">Fruit & Vegetable Processor</a></li>
          <li><a href="#">Vegetable Processing Plant</a></li>
          <li><a href="#">Ketchup & Sauce Machine</a></li>
          <li><a href="#">Pulping Machine</a></li>
          <li><a href="#">Ripening Chambers</a></li>
          <li><a href="#">Fruit & Vegetable Washer</a></li>
        </ul>
      </div>

      {/* Crusher, Shredder & Presses */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Crusher, Shredder & Presses
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Power Press</a></li>
          <li><a href="#">Shredding Machine</a></li>
          <li><a href="#">Briquetting Machine</a></li>
          <li><a href="#">Pressing Machine</a></li>
          <li><a href="#">Screw Presses</a></li>
          <li><a href="#">Trash Compactors</a></li>
          <li><a href="#">Press Forming Machines</a></li>
        </ul>
      </div>

      {/* Meat & Seafood Processing Equipments */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Meat & Seafood Processing Equipments
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Poultry Equipment</a></li>
          <li><a href="#">Meat Processing Equipment</a></li>
          <li><a href="#">Chicken Processing Plant</a></li>
        </ul>
      </div>

      {/* Oil Mill & Oil Extraction Machinery */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Oil Mill & Oil Extraction Machinery
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Oil Extraction Machine</a></li>
          <li><a href="#">Oil Production Plant</a></li>
          <li><a href="#">Oil Mill Machinery</a></li>
        </ul>
      </div>

      {/* Rubber Processing, Tyre Machinery */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Rubber Processing, Tyre Machinery
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Tyre Retreading Machine</a></li>
          <li><a href="#">Rubber Reclaim Plant & Machinery</a></li>
          <li><a href="#">Rubber Moulding Machine</a></li>
          <li><a href="#">Vulcanizing Machine</a></li>
          <li><a href="#">Rubber Crumb Making Machine</a></li>
          <li><a href="#">Tyre Cutting Machine</a></li>
          <li><a href="#">Rubber Extruder Machines</a></li>
        </ul>
      </div>

      {/* Binding and Pressing Machines */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Binding and Pressing Machines
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Heat Press Machine</a></li>
          <li><a href="#">Binding Machines</a></li>
          <li><a href="#">Engraving Machines</a></li>
          <li><a href="#">Printing Press</a></li>
          <li><a href="#">Offset Printing Press</a></li>
        </ul>
      </div>
      {/* Extraction Plants and Extruders */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Extraction Plants and Extruders
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Extruder Machine</a></li>
          <li><a href="#">Extraction Machinery</a></li>
          <li><a href="#">Gold Refining Plant</a></li>
          <li><a href="#">Metal Refining Plant</a></li>
          <li><a href="#">Pulping Machine</a></li>
        </ul>
      </div>

      {/* Testing & Measuring Equipments */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Testing & Measuring Equipments
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Testing Equipment</a></li>
          <li><a href="#">Food Testing Equipment</a></li>
          <li><a href="#">Metal Testing Equipment</a></li>
          <li><a href="#">Water Testing Equipment</a></li>
          <li><a href="#">Soil Testing Equipment</a></li>
          <li><a href="#">Hardness Tester</a></li>
          <li><a href="#">Water Testing Kits</a></li>
          <li><a href="#">Tensile Testing Machine</a></li>
          <li><a href="#">TDS Meter</a></li>
          <li><a href="#">Compression Testers</a></li>
        </ul>
      </div>

      {/* Cranes, Forklift & Lifting Machines */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Cranes, Forklift & Lifting Machines
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Forklift</a></li>
          <li><a href="#">Crane</a></li>
          <li><a href="#">Electric Hoists</a></li>
          <li><a href="#">Construction Hoist</a></li>
          <li><a href="#">Crane Spare Parts</a></li>
          <li><a href="#">Hydraulic Crane</a></li>
          <li><a href="#">Pulleys</a></li>
          <li><a href="#">Boom Lift</a></li>
          <li><a href="#">Light Crane</a></li>
          <li><a href="#">Hoist</a></li>
        </ul>
      </div>

      {/* VFD, PLC, HMI & Control Equipments */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          VFD, PLC, HMI & Control Equipments
        </h3>
        <ul className="space-y-1">
          <li><a href="#">PLC</a></li>
          <li><a href="#">Motor Drives</a></li>
          <li><a href="#">VFD</a></li>
          <li><a href="#">Lighting Controllers</a></li>
          <li><a href="#">Transmitter Device</a></li>
          <li><a href="#">Industrial Automation Systems</a></li>
          <li><a href="#">Industrial Control Panel</a></li>
          <li><a href="#">HMI</a></li>
          <li><a href="#">Alarm Systems</a></li>
          <li><a href="#">Industrial Control Systems</a></li>
        </ul>
      </div>

      {/* Heater, Thermostat & Heating Devices */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Heater, Thermostat & Heating Devices
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Water Heater & Geyser</a></li>
          <li><a href="#">Industrial Heaters</a></li>
          <li><a href="#">Heating Elements</a></li>
          <li><a href="#">Solar Water Heater</a></li>
          <li><a href="#">Heating Components & Spares</a></li>
          <li><a href="#">Heater & Heating Components</a></li>
          <li><a href="#">Industrial Water Heater</a></li>
          <li><a href="#">Room Heaters</a></li>
          <li><a href="#">Heating Coils & Tubes</a></li>
          <li><a href="#">Radiant Heating Systems</a></li>
        </ul>
      </div>

      {/* Farming Tools, Equipment & Machines */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Farming Tools, Equipment & Machines
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Agricultural Sprayers</a></li>
          <li><a href="#">Agricultural Equipment</a></li>
          <li><a href="#">Agricultural Tools</a></li>
          <li><a href="#">Agricultural Cutting Machine</a></li>
          <li><a href="#">Seeding Machine</a></li>
          <li><a href="#">Agricultural Machinery</a></li>
          <li><a href="#">Disinfectant Sprayers</a></li>
          <li><a href="#">Greenhouse Accessories</a></li>
          <li><a href="#">Fertilizer Machinery</a></li>
          <li><a href="#">Agro Shade Net</a></li>
        </ul>
      </div>

      {/* Cleaning Machines & Equipments */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Cleaning Machines & Equipments
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Vehicle Washers</a></li>
          <li><a href="#">Vacuum Cleaner</a></li>
          <li><a href="#">Pressure Washer</a></li>
          <li><a href="#">Pipes & Tank Cleaner</a></li>
          <li><a href="#">Home Vacuum Cleaner</a></li>
          <li><a href="#">Sewer & Drain Cleaner</a></li>
          <li><a href="#">Scrubbing Machine</a></li>
          <li><a href="#">Floor Cleaning Machine</a></li>
          <li><a href="#">Building & Construction Cleaning Machine</a></li>
          <li><a href="#">Industrial Cleaning Machine</a></li>
        </ul>
      </div>
       {/* Repair & Maintenance Services */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Repair & Maintenance Services
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Machinery Repairs</a></li>
          <li><a href="#">Pump Repair & Maintenance Service</a></li>
          <li><a href="#">Elevator Servicing</a></li>
          <li><a href="#">Industrial Repairing Service</a></li>
          <li><a href="#">Plant Maintenance Services</a></li>
          <li><a href="#">CNC Machines Repair & Maintenanc</a></li>
          <li><a href="#">Insulation Services</a></li>
          <li><a href="#">Annual Maintenance Contract Services</a></li>
          <li><a href="#">Hydraulic Machines Repairing</a></li>
          <li><a href="#">Welding Machine Service</a></li>
        </ul>
      </div>

      {/* Excavator and Earth Moving Machinery */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Excavator and Earth Moving Machinery
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Earthmoving Machinery Parts</a></li>
          <li><a href="#">Excavator</a></li>
          <li><a href="#">Earthmoving Machinery</a></li>
          <li><a href="#">Excavator Parts</a></li>
          <li><a href="#">Used & Second Hand Backhoe Loader and Excavator</a></li>
          <li><a href="#">Backhoe Loader</a></li>
          <li><a href="#">End Loader</a></li>
          <li><a href="#">Bucket & Rock Breaker for Excavator and Backhoe Load</a></li>
          <li><a href="#">Earthmoving Bucket</a></li>
          <li><a href="#">Wheel Loader</a></li>
        </ul>
      </div>

      {/* Elevators & Escalators */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Elevators & Escalators
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Passenger Lifts</a></li>
          <li><a href="#">Elevator Part</a></li>
          <li><a href="#">Goods Lift</a></li>
          <li><a href="#">Hydraulic Lifts</a></li>
          <li><a href="#">Elevators</a></li>
          <li><a href="#">Scissor Lifts</a></li>
          <li><a href="#">Elevator Doors</a></li>
          <li><a href="#">Elevator Cabin</a></li>
          <li><a href="#">Bucket Elevator Parts</a></li>
          <li><a href="#">Escalators</a></li>
        </ul>
      </div>

      {/* Freezers, Refrigerators & Chillers */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Freezers, Refrigerators & Chillers
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Commercial Refrigerator</a></li>
          <li><a href="#">Domestic Refrigerator</a></li>
          <li><a href="#">Fridge Accessories</a></li>
          <li><a href="#">Water Cooler</a></li>
          <li><a href="#">Freezers</a></li>
          <li><a href="#">Deep Freezer</a></li>
          <li><a href="#">Refrigerator Spare Parts</a></li>
          <li><a href="#">Ice Machine and Plants</a></li>
          <li><a href="#">Mini Fridge</a></li>
          <li><a href="#">Visi Cooler</a></li>
        </ul>
      </div>

      {/* Closing & Sealing Machines */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Closing & Sealing Machines
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Seal Machines</a></li>
          <li><a href="#">Pouch Sealing Machines</a></li>
          <li><a href="#">Bag Sealer</a></li>
          <li><a href="#">Vacuum Packaging Machines</a></li>
          <li><a href="#">Capping Machine</a></li>
          <li><a href="#">Cap Sealing Machine</a></li>
          <li><a href="#">Horizontal Form Fill Seal Machines</a></li>
          <li><a href="#">Vertical Form Fill Seal Machines</a></li>
          <li><a href="#">Pasting Machine</a></li>
          <li><a href="#">Carton Sealer</a></li>
        </ul>
      </div>

      {/* Industrial Coolers, Blowers & Fans */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Industrial Coolers, Blowers & Fans
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Industrial Air Cooler</a></li>
          <li><a href="#">Cooling Fans</a></li>
          <li><a href="#">Roof Ventilators</a></li>
          <li><a href="#">Industrial Fans</a></li>
          <li><a href="#">Axial Fans</a></li>
          <li><a href="#">Blowers</a></li>
          <li><a href="#">Industrial Exhaust Fans</a></li>
          <li><a href="#">Air Ventilation System</a></li>
          <li><a href="#">Centrifugal Fans</a></li>
          <li><a href="#">Industrial Air Blower</a></li>
        </ul>
      </div>

      {/* Plant Design & Installation Services */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Plant Design & Installation Services
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Industrial Equipment Installation</a></li>
          <li><a href="#">Installation Service</a></li>
          <li><a href="#">Plant & Equipment Erection Services</a></li>
          <li><a href="#">Industrial Design Services</a></li>
          <li><a href="#">Commissioning Services</a></li>
          <li><a href="#">Plant Installation Services</a></li>
        </ul>
      </div>
    </div>
  );
};

export default AgricultureMenu;
