import { useEffect } from "react";

const Standards = () => {
  useEffect(() => {
    document.title = "ՀՀՄՍ / ՖՀՄՍ | Շտեմարան";
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black pt-32 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white">ՀՀՄՍ / ՖՀՄՍ</h1>
          <p className="text-gray-300 mt-2">Հաշվապահական ստանդարտների շտեմարան</p>
        </header>
        {/* Content will be populated later */}
        <section className="text-gray-400">Շուտով՝ բովանդակություն և ֆիլտրեր…</section>
      </div>
    </main>
  );
};

export default Standards;
