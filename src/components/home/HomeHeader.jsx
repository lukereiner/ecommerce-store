const HomeHeader = () => {
  return (
    <div className="flex justify-center items-center text-center py-12 md:py-16">
      <section className="space-y-3">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
          The General Store
        </h1>
        <p className="text-lg md:text-xl text-gray-600 font-medium">
          For all your general needs!
        </p>
      </section>
    </div>
  );
};

export default HomeHeader;