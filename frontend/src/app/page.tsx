export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#26070B] text-[#D4AF37]">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="uppercase tracking-[0.4em] text-sm text-[#8FC7C9]">by HAI</p>
        <h1 className="mt-4 text-6xl font-bold">Render Arena</h1>
        <p className="mt-6 max-w-3xl text-xl text-[#F3E4C2]">
          Live AI image creation, prompt battles, colorway systems, render archives, and immersive storytelling futures.
        </p>
        <div className="mt-10 flex gap-4">
          <a className="rounded border border-[#D4AF37] px-6 py-3" href="/live">Enter Arena</a>
          <a className="rounded border border-[#8FC7C9] px-6 py-3" href="/render-vault">Explore Render Vault</a>
        </div>
      </section>
    </main>
  );
}
