import { useEffect } from "react";

const Discussions = () => {
  useEffect(() => {
    document.title = "Քննարկումներ | Շտեմարան";
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black pt-32 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white">Քննարկումներ</h1>
          <p className="text-gray-300 mt-2">Մասնագիտական քննարկումներ և կարծիքներ</p>
        </header>
        <section className="text-gray-400">Շուտով՝ թեմաներ…</section>
      </div>
    </main>
  );
};

export default Discussions;
