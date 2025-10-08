export default function CTASection() {
  return (
    <section className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white py-20 px-6 text-center relative overflow-hidden">
      <div className="max-w-2xl mx-auto z-10 relative">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 leading-tight">
          Ready to Explore the Best in Tech?
        </h2>
        <p className="text-lg sm:text-xl mb-8 opacity-90">
          Discover powerful solutions tailored to your business — from software to hardware, all in one place.
        </p>
        <button className="bg-white text-blue-700 hover:text-white hover:bg-blue-800 px-8 py-3 rounded-full font-semibold shadow-lg transition duration-300 ease-in-out">
          Join the Marketplace
        </button>
      </div>

      {/* Optional background accent (blurred circle) */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl z-0"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl z-0"></div>
    </section>
  );
}
