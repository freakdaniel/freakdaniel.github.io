import { useCallback, useState } from 'react';
import Hero from '../components/sections/Hero';
import Bio from '../components/sections/Bio';
import Projects from '../components/sections/Projects';
import Tech from '../components/sections/Tech';
import Contact from '../components/sections/Contact';
import Footer from '../components/sections/Footer';
import ProjectModal from '../components/ProjectModal';
import Intro from '../components/Intro';

export default function Home() {
  const [introDone, setIntroDone] = useState(false);
  const handleIntroComplete = useCallback(() => {
    setIntroDone(true);
  }, []);

  return (
    <main className="bg-bg text-fg">
      {!introDone && <Intro onComplete={handleIntroComplete} />}
      <Hero introReady={introDone} />
      <Bio />
      <Projects />
      <Tech />
      <Contact />
      <Footer />
      <ProjectModal />
    </main>
  );
}
