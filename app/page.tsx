import Grainient from '@/components/Grainient';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Grainient
          color1="#000000"
          color2="#307ffd"
          color3="#76dff9"
        />
      </div>
      <section className="relative z-10 flex min-h-screen items-center justify-center">
        <h1 className="text-white text-5xl font-bold">
          Welcome
        </h1>
      </section>
    </main>
  );
}
