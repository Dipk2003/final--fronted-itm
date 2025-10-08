const brandLogos = [
  { name: "BSH Infra", src: "/brands/Bshinfra.png" },
  { name: "Eimager", src: "/brands/Eimager.png" },
  { name: "PDCE Group", src: "/brands/Pdgroup.png" },
  { name: "Sristech", src: "/brands/Sristech.png" },
  { name: "BSHRealty", src: "/brands/BSHRealty.png" },
  { name: "StartUpIndia", src: "/brands/Startupindia.png" },
  { name: "PDSS", src: "/brands/pdss.png" },
];

export default function PremiumBrands() {
  return (
    <section className="py-16 bg-white border-t ">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-10">
          Explore products from <span className="text-blue-600">Premium Brands</span>
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
          {brandLogos.map((brand, index) => (
            <div key={index} className="flex items-center justify-center hover:scale-105 transition-transform duration-300">
              <img
                src={brand.src}
                alt={brand.name}
                className="max-h-16 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
