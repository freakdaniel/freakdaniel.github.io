import Hero from '../components/sections/Hero';
import Bio from '../components/sections/Bio';
import Projects from '../components/sections/Projects';
import Tech from '../components/sections/Tech';
import Contact from '../components/sections/Contact';
import Footer from '../components/sections/Footer';

export default function Home() {
  return (
    <main className="bg-bg text-fg">
      <Hero />
      <Bio />
      <Projects />
      <Tech />
      <Contact />
      <Footer />
    </main>
  );
}
