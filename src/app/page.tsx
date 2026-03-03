import HomeScene from "@/components/HomeScene";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black text-white">
      <HomeScene />

      {/* Overlay UI */}
      <div className="pointer-events-none absolute inset-0">
        <div className="pointer-events-auto absolute top-6 left-6 font-mono">
          <div className="text-xl font-bold">JAY</div>
          <div className="opacity-80">Building Stuff.</div>
        </div>

        <div className="pointer-events-auto absolute bottom-6 right-6 flex gap-3 font-mono">
          <a
            href="https://github.com/jaychauhan1"
            target="_blank"
            rel="noreferrer"
            className="border border-white/20 px-3 py-2 hover:border-white/50"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/adityasinh100"
            target="_blank"
            rel="noreferrer"
            className="border border-white/20 px-3 py-2 hover:border-white/50"
          >
            LinkedIn
          </a>
          <a
            href="/resume.pdf"
            className="border border-white/20 px-3 py-2 hover:border-white/50"
          >
            Resume
          </a>
        </div>
      </div>
    </main>
  );
}