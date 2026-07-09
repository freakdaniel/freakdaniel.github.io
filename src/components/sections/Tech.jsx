import FadeIn from '../ui/FadeIn';
import SectionHeader from '../ui/SectionHeader';

const groups = [
  {
    title: 'Frontend',
    items: ['React', 'TypeScript', 'Tailwind', 'Vue'],
  },
  {
    title: 'Backend',
    items: ['Node.js', '.NET', 'MySQL', 'MongoDB'],
  },
  {
    title: 'Tools',
    items: ['WebStorm', 'Figma', 'Linux', 'Git'],
  },
];

export default function Tech() {
  return (
    <section id="tech" className="px-6 sm:px-10 lg:px-16 py-32">
      <div className="mx-auto w-full max-w-6xl space-y-16">
        <FadeIn>
          <SectionHeader label="03 — Tech" title="Stack & tools" />
        </FadeIn>

        <FadeIn stagger>
          <dl className="reveal-stagger grid gap-12 sm:grid-cols-3">
            {groups.map((g, gi) => (
              <div key={g.title} className="flex flex-col gap-4">
                <dt
                  className="reveal-child text-sm uppercase tracking-[0.2em] text-muted border-b border-line pb-3"
                  style={{ '--i': gi }}
                >
                  {g.title}
                </dt>
                <dd>
                  <ul className="flex flex-col gap-2">
                    {g.items.map((item, ii) => (
                      <li
                        key={item}
                        className="reveal-child text-base text-fg"
                        style={{ '--i': gi * 4 + ii + 1 }}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </FadeIn>
      </div>
    </section>
  );
}
