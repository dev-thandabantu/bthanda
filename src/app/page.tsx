import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import Recognition from "@/components/Recognition";
import About from "@/components/About";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="max-w-3xl mx-auto px-6 pb-32">
        <Hero />
        <Work />
        <Recognition />
        <About />
        <Contact />
      </main>
    </>
  );
}
