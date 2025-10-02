import { useEffect } from "react";

const TestsAccounting = () => {
  useEffect(() => {
    document.title = "Թեստեր · Հաշվապահական և ֆինանսական";
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black pt-32 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white">Թեստեր · Հաշվապահական և ֆինանսական ոլորտ</h1>
          <p className="text-gray-300 mt-2">Գիտելիքի ստուգման հարցաշարեր</p>
        </header>
        <section className="text-gray-400">Շուտով՝ թեստեր…</section>
      </div>
    </main>
  );
};

export default TestsAccounting;
