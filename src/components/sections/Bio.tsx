import FadeIn from '../ui/FadeIn';
import SectionHeader from '../ui/SectionHeader';

interface Stat {
  value: string;
  label: string;
}

const stats: Stat[] = [
  { value: '4+', label: 'Years building' },
  { value: '15+', label: 'Projects shipped' },
  { value: '12+', label: 'Tools in the kit' },
];

export default function Bio() {
  return (
    <section id="about" className="px-6 sm:px-10 lg:px-16 py-32">
      <div className="mx-auto w-full max-w-6xl grid gap-16 lg:grid-cols-[1fr_1.4fr]">
        <FadeIn>
          <SectionHeader label="01 — About" title="A bit about me" />
        </FadeIn>

        <FadeIn delay={120}>
          <div className="space-y-6 text-lg leading-relaxed text-muted">
            <p>
              I'm a full-stack developer who likes clean interfaces, fast
              load times, and code that's pleasant to come back to six
              months later. Most of my work lives in TypeScript, React and
              Node — though I keep coming back to the .NET ecosystem for
              anything that needs to be solid rather than shiny.
            </p>
            <p>
              Outside of the keyboard, I'm usually reading something too
              long, tinkering with self-hosted services, or learning yet
              another language I'll never finish a project in.
            </p>
          </div>

          <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-line pt-8">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col gap-1">
                <dt className="text-2xl sm:text-3xl font-medium tracking-tight text-fg">
                  {s.value}
                </dt>
                <dd className="text-sm text-muted">{s.label}</dd>
              </div>
            ))}
          </dl>
        </FadeIn>
      </div>
    </section>
  );
}
