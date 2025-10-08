import React from "react";

const FoodAndBeveragesMenu = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-3 lg:gap-4 xl:gap-6">

      {/* Flavours & Aromatics */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Flavours & Aromatics
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Food Emulsifiers</a></li>
          <li><a href="#">Silicon Dioxide</a></li>
          <li><a href="#">Dough Conditioners</a></li>
          <li><a href="#">Bakery & Confectionery Flavors</a></li>
          <li><a href="#">Sweetener</a></li>
          <li><a href="#">Starch Powder</a></li>
          <li><a href="#">Food Stabilizer</a></li>
          <li><a href="#">Beverage Flavors</a></li>
          <li><a href="#">Food Colors</a></li>
          <li><a href="#">Vinegar</a></li>
          <li><a href="#">Food Grade Chemical</a></li>
          <li><a href="#">Fruit Flavor</a></li>
          <li><a href="#">Food Flavour</a></li>
          <li><a href="#">Dry Powder Flavours</a></li>
          <li><a href="#">Emulsifiers</a></li>
          <li><a href="#">Food Acidulant</a></li>
          <li><a href="#">Natural Sweetener</a></li>
          <li><a href="#">Antioxidants</a></li>
          <li><a href="#">Food Enzymes</a></li>
          <li><a href="#">Artificial Sweetener</a></li>
          <li><a href="#">Dessert Flavor</a></li>
          <li><a href="#">Dairy Flavors</a></li>
          <li><a href="#">Spice Flavour</a></li>
          <li><a href="#">Aroma Flavour</a></li>
          <li><a href="#">Anti Caking Agents</a></li>
          <li><a href="#">Invert Sugar Syrup</a></li>
          <li><a href="#">Savory Flavors</a></li>
        </ul>
      </div>

      {/* Cereals & Food Grains */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Cereals & Food Grains
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Rice</a></li>
          <li><a href="#">Basmati Rice</a></li>
          <li><a href="#">Non Basmati Rice</a></li>
          <li><a href="#">Food Grains</a></li>
          <li><a href="#">Pulses</a></li>
          <li><a href="#">Wheat</a></li>
          <li><a href="#">Flours</a></li>
          <li><a href="#">Sugar</a></li>
          <li><a href="#">Agro Products</a></li>
          <li><a href="#">Wheat Flour</a></li>
          <li><a href="#">Gud Jaggery</a></li>
          <li><a href="#">Organic Sugar</a></li>
          <li><a href="#">Chana</a></li>
          <li><a href="#">Dried Beans</a></li>
          <li><a href="#">Organic Flour</a></li>
          <li><a href="#">Organic Pulses</a></li>
          <li><a href="#">Brown Rice</a></li>
          <li><a href="#">Semolina</a></li>
          <li><a href="#">Organic Molasses</a></li>
          <li><a href="#">Rajma</a></li>
        </ul>
      </div>

      {/* Cooking Spices and Masala */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Cooking Spices and Masala
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Whole Spices</a></li>
          <li><a href="#">Seed Spices</a></li>
          <li><a href="#">Masala Mix</a></li>
          <li><a href="#">Turmeric Products</a></li>
          <li><a href="#">Masala Powder</a></li>
          <li><a href="#">Edible Salt</a></li>
          <li><a href="#">Dried Chillies & Pepper</a></li>
          <li><a href="#">Vegetable Powders</a></li>
          <li><a href="#">Mustard Seeds</a></li>
          <li><a href="#">Masala</a></li>
          <li><a href="#">Chilli Powder</a></li>
          <li><a href="#">Dhaniya</a></li>
          <li><a href="#">Seasonings</a></li>
          <li><a href="#">Saffron</a></li>
          <li><a href="#">Organic Spices</a></li>
          <li><a href="#">Cooking Paste</a></li>
        </ul>
      </div>
      {/* Milk & Dairy Products */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Milk & Dairy Products
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Milk Powder</a></li>
          <li><a href="#">Pure Ghee</a></li>
          <li><a href="#">Ice Cream</a></li>
          <li><a href="#">Dairy Products</a></li>
          <li><a href="#">Milk</a></li>
          <li><a href="#">Cheese</a></li>
          <li><a href="#">Ice Cream Raw Materials</a></li>
          <li><a href="#">Paneer</a></li>
          <li><a href="#">Butter</a></li>
          <li><a href="#">Dairy Ingredients</a></li>
          <li><a href="#">Curd</a></li>
          <li><a href="#">Flavoured Milk</a></li>
          <li><a href="#">Peanut butter</a></li>
          <li><a href="#">Fresh Cheese</a></li>
          <li><a href="#">Lassi</a></li>
          <li><a href="#">Imported Cheese</a></li>
        </ul>
      </div>

      {/* Bakery & Confectionery Products */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Bakery & Confectionery Products
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Candy & Jelly</a></li>
          <li><a href="#">Confectionery Ingredients</a></li>
          <li><a href="#">Bakery Products</a></li>
          <li><a href="#">Mouth Freshener</a></li>
          <li><a href="#">Bread & Buns</a></li>
          <li><a href="#">Cake</a></li>
          <li><a href="#">Rusk Toast</a></li>
          <li><a href="#">Bakery Ingredients</a></li>
          <li><a href="#">Toffees</a></li>
          <li><a href="#">Pastry</a></li>
          <li><a href="#">Bakery Sweets</a></li>
          <li><a href="#">Muffin & Cupcakes</a></li>
          <li><a href="#">Pies</a></li>
          <li><a href="#">Ice Cream Raw Materials</a></li>
          <li><a href="#">Peanut butter</a></li>
        </ul>
      </div>

      {/* Snacks and Namkeen */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Snacks and Namkeen
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Namkeen</a></li>
          <li><a href="#">Chips</a></li>
          <li><a href="#">Papad</a></li>
          <li><a href="#">Snack Foods</a></li>
          <li><a href="#">Roasted Snack</a></li>
          <li><a href="#">Fryums</a></li>
          <li><a href="#">Healthy Food Snacks</a></li>
          <li><a href="#">Veg Snacks</a></li>
          <li><a href="#">Sev and Bhujia</a></li>
          <li><a href="#">Chocolate Snacks</a></li>
          <li><a href="#">Khakhra</a></li>
          <li><a href="#">Nut Snack and Popcorn</a></li>
          <li><a href="#">Non Veg Snack</a></li>
        </ul>
      </div>
      {/* Juices, Soups & Soft Drinks */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Juices, Soups & Soft Drinks
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Drinking Water</a></li>
          <li><a href="#">Carbonated Drinks</a></li>
          <li><a href="#">Mineral Water Bottle</a></li>
          <li><a href="#">Packaged Drinking Water</a></li>
          <li><a href="#">Energy Drink</a></li>
          <li><a href="#">Fruit Juice</a></li>
          <li><a href="#">Beverages Mixes</a></li>
          <li><a href="#">Cold Drink</a></li>
          <li><a href="#">Instant Drink Mix</a></li>
          <li><a href="#">Fruit Beverage</a></li>
          <li><a href="#">Fruit Drinks</a></li>
          <li><a href="#">Fruit Syrups</a></li>
          <li><a href="#">Fruit Concentrate</a></li>
          <li><a href="#">Fruit Squashes</a></li>
          <li><a href="#">Vegetable Juices</a></li>
        </ul>
      </div>

      {/* Fresh, Dried & Preserved Vegetables */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Fresh, Dried & Preserved Vegetables
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Fresh Vegetables</a></li>
          <li><a href="#">Onion</a></li>
          <li><a href="#">Mushroom</a></li>
          <li><a href="#">Garlic</a></li>
          <li><a href="#">Potato</a></li>
          <li><a href="#">Root Vegetables</a></li>
          <li><a href="#">Frozen Vegetables</a></li>
          <li><a href="#">Exotic Vegetables</a></li>
          <li><a href="#">Chilli</a></li>
          <li><a href="#">Dried Vegetables</a></li>
          <li><a href="#">Vegetable & Herb Flakes</a></li>
          <li><a href="#">Beans</a></li>
          <li><a href="#">Dehydrated Vegetable</a></li>
          <li><a href="#">Lettuce</a></li>
          <li><a href="#">Vegetable Granule</a></li>
        </ul>
      </div>

      {/* Chocolates, Biscuits & Cookies */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Chocolates, Biscuits & Cookies
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Chocolate</a></li>
          <li><a href="#">Biscuit</a></li>
          <li><a href="#">Cookies</a></li>
          <li><a href="#">Bakery Cookies</a></li>
        </ul>
      </div>
      {/* Fresh, Dried & Preserved Fruits */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Fresh, Dried & Preserved Fruits
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Fresh Fruits</a></li>
          <li><a href="#">Mangoes</a></li>
          <li><a href="#">Coconut</a></li>
          <li><a href="#">Tropical Fruits</a></li>
          <li><a href="#">Berries</a></li>
          <li><a href="#">Fruit Pulp</a></li>
          <li><a href="#">Apple</a></li>
          <li><a href="#">Citrus Fruits</a></li>
          <li><a href="#">Fruit Powder</a></li>
          <li><a href="#">Frozen Fruits</a></li>
          <li><a href="#">Preserved Fruits</a></li>
        </ul>
      </div>

      {/* Tea & Coffee */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Tea & Coffee
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Black Tea</a></li>
          <li><a href="#">Tea</a></li>
          <li><a href="#">Coffee</a></li>
          <li><a href="#">Coffee Powder</a></li>
          <li><a href="#">Coffee Beans</a></li>
          <li><a href="#">Flavored Tea</a></li>
          <li><a href="#">Tea Powder</a></li>
          <li><a href="#">Tea Premix</a></li>
          <li><a href="#">Green Tea</a></li>
          <li><a href="#">Herbal Tea</a></li>
          <li><a href="#">Tea Bags</a></li>
          <li><a href="#">Flower Tea</a></li>
          <li><a href="#">Ice Tea</a></li>
          <li><a href="#">Fruit Tea</a></li>
        </ul>
      </div>

      {/* Ready to Eat & Instant Food Mixes */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Ready to Eat & Instant Food Mixes
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Frozen Food</a></li>
          <li><a href="#">Noodles & Vermicelli</a></li>
          <li><a href="#">Ready to Eat Food</a></li>
          <li><a href="#">Pasta & Soups</a></li>
          <li><a href="#">Instant Food Mix</a></li>
          <li><a href="#">Breakfast Cereals</a></li>
          <li><a href="#">Cooking Paste</a></li>
          <li><a href="#">Canned Food</a></li>
          <li><a href="#">Noodles Pasta & Instant Food</a></li>
          <li><a href="#">Frozen Vegetables</a></li>
        </ul>
      </div>
      {/* Dry Fruits & Nuts */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Dry Fruits & Nuts
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Dry Fruits</a></li>
          <li><a href="#">Edible Nuts</a></li>
          <li><a href="#">Cashew Nuts</a></li>
          <li><a href="#">Consumable Seeds</a></li>
          <li><a href="#">Peanut</a></li>
          <li><a href="#">Almond</a></li>
          <li><a href="#">Dates</a></li>
          <li><a href="#">Edible Seeds</a></li>
          <li><a href="#">Raisins</a></li>
          <li><a href="#">Dehydrated Fruits</a></li>
          <li><a href="#">Dry Fruit Powder</a></li>
          <li><a href="#">Walnut</a></li>
        </ul>
      </div>

      {/* Indian Sweets & Desserts */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Indian Sweets & Desserts
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Sweets</a></li>
          <li><a href="#">Milk Sweets</a></li>
          <li><a href="#">Bengali Sweets</a></li>
          <li><a href="#">Laddu</a></li>
          <li><a href="#">Chikki</a></li>
          <li><a href="#">Soan Papdi</a></li>
          <li><a href="#">Barfi</a></li>
          <li><a href="#">Peda</a></li>
          <li><a href="#">Halwa</a></li>
          <li><a href="#">Petha</a></li>
          <li><a href="#">Kaju Sweets</a></li>
          <li><a href="#">Dry Fruit Sweets</a></li>
          <li><a href="#">Gazak</a></li>
          <li><a href="#">Gujarati Sweets</a></li>
        </ul>
      </div>

      {/* Pickles, Jams & Ketchups */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Pickles, Jams & Ketchups
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Sauces</a></li>
          <li><a href="#">Pickles</a></li>
          <li><a href="#">Chutney</a></li>
          <li><a href="#">Marmalades</a></li>
          <li><a href="#">Jam</a></li>
        </ul>
      </div>

      {/* Edible Oil & Allied Products */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Edible Oil & Allied Products
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Cooking Oil</a></li>
          <li><a href="#">Mustard Oil</a></li>
          <li><a href="#">Refined Oil</a></li>
          <li><a href="#">Palm Oil</a></li>
          <li><a href="#">Sunflower Oil</a></li>
          <li><a href="#">Coconut Oil</a></li>
          <li><a href="#">Groundnut Oil</a></li>
          <li><a href="#">Cold Pressed Oil</a></li>
          <li><a href="#">Nut Oils</a></li>
          <li><a href="#">Edible Oil</a></li>
          <li><a href="#">Olive Oil</a></li>
          <li><a href="#">Fish Oil</a></li>
        </ul>
      </div>

      {/* Marine Food Supplies */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Marine Food Supplies
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Fresh Fish</a></li>
          <li><a href="#">Seafood</a></li>
          <li><a href="#">Fish Seeds</a></li>
          <li><a href="#">Shrimp</a></li>
          <li><a href="#">Fish Fillet</a></li>
          <li><a href="#">Squid</a></li>
        </ul>
      </div>

      {/* Organic Food Grains & Vegetables */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Organic Food Grains & Vegetables
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Organic Food Grains</a></li>
          <li><a href="#">Organic Spices</a></li>
          <li><a href="#">Organic Oils</a></li>
          <li><a href="#">Organic Vegetable</a></li>
          <li><a href="#">Organic Molasses</a></li>
        </ul>
      </div>
      {/* Meat & Poultry Food */}
      <div className="space-y-2">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">
          Meat & Poultry Food
        </h3>
        <ul className="space-y-1">
          <li><a href="#">Egg</a></li>
          <li><a href="#">Poultry Meat</a></li>
          <li><a href="#">Fresh Meat</a></li>
          <li><a href="#">Frozen Meat</a></li>
          <li><a href="#">Buffalo Meat</a></li>
          <li><a href="#">Frozen Chicken</a></li>
          <li><a href="#">Meat Products</a></li>
          <li><a href="#">Chicken</a></li>
        </ul>
      </div>
    </div>
  );
};

export default FoodAndBeveragesMenu;
