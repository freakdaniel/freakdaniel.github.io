import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import {
  getTechById,
  techGroupOrder,
  techStack,
  type TechGroupKey,
  type TechId,
  type TechItem,
} from '../../data/techStack';

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function itemsFor(group: TechGroupKey): TechItem[] {
  return techStack.filter((t) => t.groupKey === group);
}

function orderGroup(group: TechGroupKey, leadId: TechId): TechItem[] {
  const items = itemsFor(group);
  const lead = items.find((t) => t.id === leadId) ?? items[0];
  if (!lead) return items;
  return [lead, ...items.filter((t) => t.id !== lead.id)];
}

function defaultLeads(): Record<TechGroupKey, TechId> {
  return {
    frontend: itemsFor('frontend')[0]?.id ?? 'react',
    backend: itemsFor('backend')[0]?.id ?? 'nodejs',
    tools: itemsFor('tools')[0]?.id ?? 'webstorm',
  };
}

const FAN_CENTER_Y = 0.4;

function fanSide() {
  if (typeof window === 'undefined') return 5;
  const w = window.innerWidth;
  if (w < 768) return 2;
  if (w < 1024) return 3;
  return 5;
}

function fanSpacing() {
  if (typeof window === 'undefined') return 92;
  const w = window.innerWidth;
  if (w < 480) return 56;
  if (w < 768) return 64;
  if (w < 900) return 72;
  return 92;
}

function isTouchUi() {
  return (
    typeof window !== 'undefined' &&
    (window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(hover: none)').matches)
  );
}

function fanPose(i: number, activeIndex: number) {
  const offset = i - activeIndex;
  const abs = Math.abs(offset);
  const isActive = offset === 0;
  const spacing = fanSpacing();
  const side = fanSide();

  if (abs > side) {
    const edge = Math.sign(offset || 1) * side * spacing;
    return {
      x: edge,
      y: abs * 2,
      scale: 0.78,
      opacity: 0,
      zIndex: 1,
    };
  }

  return {
    x: offset * spacing,
    y: isActive ? 0 : abs * 3,
    scale: isActive ? 1 : 0.9,
    opacity: isActive ? 1 : 0.45,
    zIndex: 100 - abs,
  };
}

const fanBase = {
  left: '50%',
  top: '50%',
  xPercent: -50,
  yPercent: -50,
};

export default function TechShowcase() {
  const { t } = useTranslation();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const fanRef = useRef<HTMLDivElement | null>(null);
  const detailRef = useRef<HTMLDivElement | null>(null);
  const expandTlRef = useRef<gsap.core.Timeline | null>(null);
  const burstFromCenterRef = useRef(false);
  const collapseHomeRef = useRef<TechGroupKey | null>(null);

  const [leadByGroup, setLeadByGroup] = useState(defaultLeads);
  const [expandedGroup, setExpandedGroup] = useState<TechGroupKey | null>(
    null
  );
  const [activeId, setActiveId] = useState<TechId | null>(null);
  const [busy, setBusy] = useState(false);

  const expandedItems = useMemo(() => {
    if (!expandedGroup) return [];
    return orderGroup(expandedGroup, leadByGroup[expandedGroup]);
  }, [expandedGroup, leadByGroup]);

  const activeIndex = useMemo(() => {
    if (!activeId) return 0;
    const i = expandedItems.findIndex((x) => x.id === activeId);
    return i < 0 ? 0 : i;
  }, [expandedItems, activeId]);

  const activeTech = activeId ? getTechById(activeId) : null;

  const stepActive = useCallback(
    (dir: -1 | 1) => {
      if (!expandedGroup || activeId == null || busy) return;
      const list = orderGroup(expandedGroup, leadByGroup[expandedGroup]);
      const i = list.findIndex((t) => t.id === activeId);
      if (i < 0) return;
      const next = list[i + dir];
      if (!next) return;
      setActiveId(next.id);
    },
    [expandedGroup, activeId, busy, leadByGroup]
  );

  useEffect(() => {
    const fan = fanRef.current;
    if (!fan || !expandedGroup || !isTouchUi()) return;

    let startX = 0;
    let startY = 0;
    let tracking = false;
    let pointerId: number | null = null;

    const onDown = (e: PointerEvent) => {
      if (busy) return;
      if (e.pointerType === 'mouse') return;
      tracking = true;
      pointerId = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;
      try {
        fan.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    };

    const onUp = (e: PointerEvent) => {
      if (!tracking || (pointerId != null && e.pointerId !== pointerId)) return;
      tracking = false;
      pointerId = null;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.15) return;
      stepActive(dx < 0 ? 1 : -1);
    };

    const onCancel = () => {
      tracking = false;
      pointerId = null;
    };

    fan.addEventListener('pointerdown', onDown);
    fan.addEventListener('pointerup', onUp);
    fan.addEventListener('pointercancel', onCancel);
    return () => {
      fan.removeEventListener('pointerdown', onDown);
      fan.removeEventListener('pointerup', onUp);
      fan.removeEventListener('pointercancel', onCancel);
    };
  }, [expandedGroup, stepActive, busy]);

  const collapse = useCallback(() => {
    if (busy || !expandedGroup || !activeId) return;

    const group = expandedGroup;
    const leadId = activeId;
    const root = rootRef.current;
    const fan = fanRef.current;

    const finishInstant = () => {
      setLeadByGroup((prev) => ({ ...prev, [group]: leadId }));
      collapseHomeRef.current = null;
      burstFromCenterRef.current = false;
      setExpandedGroup(null);
      setActiveId(null);
      setBusy(false);
    };

    if (!root || !fan || prefersReducedMotion()) {
      finishInstant();
      return;
    }

    setBusy(true);
    expandTlRef.current?.kill();

    const cards = fan.querySelectorAll<HTMLElement>('[data-fan-card]');
    const detail = detailRef.current;
    const groupLabel = root.querySelector<HTMLElement>('.tech-decks-focus-group');

    const tl = gsap.timeline({
      onComplete: () => {
        setLeadByGroup((prev) => ({ ...prev, [group]: leadId }));
        collapseHomeRef.current = group;
        burstFromCenterRef.current = false;
        setExpandedGroup(null);
        setActiveId(null);
      },
    });
    expandTlRef.current = tl;

    cards.forEach((card, i) => {
      if (i === activeIndex) return;
      tl.to(
        card,
        {
          x: 0,
          y: 0,
          scale: 0.55,
          opacity: 0,
          duration: 0.38,
          ease: 'power2.in',
        },
        0
      );
    });

    tl.to(
      [detail, groupLabel].filter(Boolean),
      { opacity: 0, duration: 0.22, ease: 'power2.in' },
      0.05
    );

    tl.to({}, { duration: 0.08 });
  }, [busy, expandedGroup, activeId, activeIndex]);

  useEffect(() => {
    if (!expandedGroup) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') collapse();
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        stepActive(-1);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        stepActive(1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [expandedGroup, collapse, stepActive]);

  const expand = (group: TechGroupKey) => {
    if (busy || expandedGroup) return;
    const list = orderGroup(group, leadByGroup[group]);
    const first = list[0];
    if (!first) return;

    const root = rootRef.current;
    if (!root || prefersReducedMotion()) {
      setExpandedGroup(group);
      setActiveId(first.id);
      burstFromCenterRef.current = false;
      return;
    }

    const col = root.querySelector<HTMLElement>(
      `[data-deck-col][data-group="${group}"]`
    );
    if (!col) {
      setExpandedGroup(group);
      setActiveId(first.id);
      return;
    }

    const otherCols = root.querySelectorAll<HTMLElement>(
      `[data-deck-col]:not([data-group="${group}"])`
    );
    const trailCards = col.querySelectorAll<HTMLElement>('[data-trail-card]');
    const front = col.querySelector<HTMLElement>('[data-front]');
    const label = col.querySelector<HTMLElement>('[data-deck-label]');
    if (!front) {
      setExpandedGroup(group);
      setActiveId(first.id);
      return;
    }

    setBusy(true);
    expandTlRef.current?.kill();

    const rootBox = root.getBoundingClientRect();
    const frontBox = front.getBoundingClientRect();
    const targetX =
      rootBox.left +
      rootBox.width / 2 -
      (frontBox.left + frontBox.width / 2);
    const targetY =
      rootBox.top +
      rootBox.height * FAN_CENTER_Y -
      (frontBox.top + frontBox.height / 2);

    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => {
        burstFromCenterRef.current = true;
        setExpandedGroup(group);
        setActiveId(first.id);
        setBusy(false);
      },
    });
    expandTlRef.current = tl;

    const tuckStagger = 0.07;
    const tuckDur = 0.42;
    trailCards.forEach((card, i) => {
      const cardBox = card.getBoundingClientRect();
      const dx =
        frontBox.left +
        frontBox.width / 2 -
        (cardBox.left + cardBox.width / 2);
      const dy =
        frontBox.top +
        frontBox.height / 2 -
        (cardBox.top + cardBox.height / 2);
      tl.to(
        card,
        {
          x: dx,
          y: dy,
          scale: 0.85,
          opacity: 0,
          duration: tuckDur,
          ease: 'power2.in',
        },
        i * tuckStagger
      );
    });

    const tuckEnd =
      trailCards.length > 0
        ? (trailCards.length - 1) * tuckStagger + tuckDur + 0.1
        : 0.08;

    tl.to(
      otherCols,
      {
        opacity: 0,
        y: 14,
        duration: 0.34,
        stagger: 0.04,
        ease: 'power2.in',
      },
      0.04
    );

    if (label) {
      tl.to(label, { opacity: 0, y: -6, duration: 0.22 }, 0);
    }

    tl.to(
      front,
      {
        x: targetX,
        y: targetY,
        scale: 1,
        duration: 0.52,
        ease: 'power3.inOut',
      },
      tuckEnd
    );
  };

  useLayoutEffect(() => {
    if (expandedGroup) return;
    const root = rootRef.current;
    if (!root) return;

    const grid = root.querySelector<HTMLElement>('.tech-decks-grid');
    const homeGroup = collapseHomeRef.current;
    collapseHomeRef.current = null;

    if (grid) {
      gsap.set(grid, { clearProps: 'opacity,visibility,pointerEvents' });
      gsap.set(grid, { autoAlpha: 1, pointerEvents: 'auto' });
    }

    if (homeGroup && !prefersReducedMotion()) {
      const homeCol = root.querySelector<HTMLElement>(
        `[data-deck-col][data-group="${homeGroup}"]`
      );
      const otherCols = root.querySelectorAll<HTMLElement>(
        `[data-deck-col]:not([data-group="${homeGroup}"])`
      );
      const front = homeCol?.querySelector<HTMLElement>('[data-front]');
      const trails =
        homeCol?.querySelectorAll<HTMLElement>('[data-trail-card]') ?? [];
      const label = homeCol?.querySelector<HTMLElement>('[data-deck-label]');

      if (homeCol && front) {
        const rootBox = root.getBoundingClientRect();
        gsap.set([homeCol, front, ...trails, label].filter(Boolean), {
          clearProps: 'transform,opacity,x,y,scale',
        });
        gsap.set(otherCols, { opacity: 0, y: 12 });
        gsap.set(homeCol, { opacity: 1 });
        if (label) gsap.set(label, { opacity: 0 });
        gsap.set(trails, { opacity: 0, y: -24, scale: 0.9 });

        const frontBox = front.getBoundingClientRect();
        const fromX =
          rootBox.left +
          rootBox.width / 2 -
          (frontBox.left + frontBox.width / 2);
        const fromY =
          rootBox.top +
          rootBox.height * FAN_CENTER_Y -
          (frontBox.top + frontBox.height / 2);

        gsap.set(front, { x: fromX, y: fromY, scale: 1, opacity: 1 });

        const tl = gsap.timeline({
          onComplete: () => {
            gsap.set(
              [homeCol, front, ...trails, label, ...otherCols].filter(Boolean),
              { clearProps: 'transform,opacity,x,y,scale' }
            );
            setBusy(false);
          },
        });

        tl.to(front, {
          x: 0,
          y: 0,
          duration: 0.52,
          ease: 'power3.inOut',
        });

        trails.forEach((card, i) => {
          tl.to(
            card,
            {
              y: 0,
              scale: 1,
              opacity: 1,
              duration: 0.38,
              ease: 'power2.out',
              clearProps: 'transform',
            },
            0.3 + i * 0.06
          );
        });

        if (label) {
          tl.to(
            label,
            { opacity: 1, duration: 0.25, ease: 'power2.out' },
            0.34
          );
        }

        tl.to(
          otherCols,
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: 'power3.out',
            clearProps: 'transform',
          },
          0.32
        );

        return () => {
          tl.kill();
        };
      }

      setBusy(false);
    }

    const allCols = root.querySelectorAll<HTMLElement>('[data-deck-col]');
    const allFronts = root.querySelectorAll<HTMLElement>('[data-front]');
    const allTrails = root.querySelectorAll<HTMLElement>('[data-trail-card]');
    const allLabels = root.querySelectorAll<HTMLElement>('[data-deck-label]');

    gsap.set(allCols, { clearProps: 'opacity,transform,pointerEvents,scale' });
    gsap.set(allLabels, { clearProps: 'opacity,transform' });
    gsap.set(allFronts, { clearProps: 'transform,opacity,x,y,scale' });
    gsap.set(allTrails, { clearProps: 'transform,opacity,x,y,scale' });
    setBusy(false);

    if (prefersReducedMotion()) return;

    gsap.fromTo(
      allCols,
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.07,
        ease: 'power3.out',
        clearProps: 'transform',
      }
    );
  }, [expandedGroup]);

  useLayoutEffect(() => {
    if (!expandedGroup || !fanRef.current || !rootRef.current) return;
    const root = rootRef.current;
    const grid = root.querySelector<HTMLElement>('.tech-decks-grid');
    const cards =
      fanRef.current.querySelectorAll<HTMLElement>('[data-fan-card]');
    const reduce = prefersReducedMotion();
    const burst = burstFromCenterRef.current;
    burstFromCenterRef.current = false;

    cards.forEach((card, i) => {
      const pose = fanPose(i, activeIndex);
      const inBand = Math.abs(i - activeIndex) <= fanSide();
      card.style.pointerEvents = inBand ? 'auto' : 'none';

      if (burst || reduce) {
        if (i === activeIndex) {
          gsap.set(card, {
            ...fanBase,
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            zIndex: pose.zIndex,
          });
        } else if (burst) {
          gsap.set(card, {
            ...fanBase,
            x: 0,
            y: 0,
            scale: 0.55,
            opacity: 0,
            zIndex: pose.zIndex,
          });
        } else {
          gsap.set(card, { ...fanBase, ...pose });
        }
      }
    });

    if (grid) {
      gsap.set(grid, { autoAlpha: 0, pointerEvents: 'none' });
    }

    if (reduce) {
      cards.forEach((card, i) => {
        gsap.set(card, { ...fanBase, ...fanPose(i, activeIndex) });
      });
      return;
    }

    if (burst) {
      cards.forEach((card, i) => {
        if (i === activeIndex) return;
        const pose = fanPose(i, activeIndex);
        gsap.to(card, {
          ...fanBase,
          ...pose,
          duration: 0.55,
          delay: 0.06 + Math.min(Math.abs(i - activeIndex), fanSide()) * 0.05,
          ease: 'power3.out',
        });
      });
    } else {
      cards.forEach((card, i) => {
        gsap.to(card, {
          ...fanBase,
          ...fanPose(i, activeIndex),
          duration: 0.45,
          ease: 'power3.out',
        });
      });
    }
  }, [expandedGroup, activeIndex, expandedItems.length]);

  const detailAnimKeyRef = useRef<string | null>(null);
  const chromeAnimKeyRef = useRef<string | null>(null);
  const contentTweenRef = useRef<gsap.core.Tween | gsap.core.Timeline | null>(
    null
  );

  useEffect(() => {
    if (!expandedGroup) {
      detailAnimKeyRef.current = null;
      chromeAnimKeyRef.current = null;
      contentTweenRef.current?.kill();
      contentTweenRef.current = null;
    }
  }, [expandedGroup]);

  useLayoutEffect(() => {
    if (!expandedGroup || !activeId) return;

    const detail = detailRef.current;
    const groupLabel = rootRef.current?.querySelector<HTMLElement>(
      '.tech-decks-focus-group'
    );
    if (!detail) return;

    const detailKey = `${expandedGroup}:${activeId}`;
    const chromeKey = expandedGroup;
    const isFirstChrome = chromeAnimKeyRef.current !== chromeKey;
    const isNewDetail = detailAnimKeyRef.current !== detailKey;

    if (!isFirstChrome && !isNewDetail) {
      gsap.set(detail, { opacity: 1 });
      if (groupLabel) gsap.set(groupLabel, { opacity: 1 });
      return;
    }

    contentTweenRef.current?.kill();
    gsap.killTweensOf([detail, groupLabel].filter(Boolean));

    detailAnimKeyRef.current = detailKey;
    chromeAnimKeyRef.current = chromeKey;

    if (prefersReducedMotion()) {
      gsap.set(detail, { opacity: 1 });
      if (groupLabel) gsap.set(groupLabel, { opacity: 1 });
      return;
    }

    if (isFirstChrome) {
      const targets = [groupLabel, detail].filter(Boolean) as HTMLElement[];
      gsap.set(targets, { opacity: 0 });
      contentTweenRef.current = gsap.to(targets, {
        opacity: 1,
        duration: 0.34,
        stagger: 0.05,
        ease: 'power2.out',
        delay: 0.05,
      });
      return;
    }

    if (isNewDetail) {
      if (groupLabel) gsap.set(groupLabel, { opacity: 1 });
      gsap.set(detail, { opacity: 0 });
      contentTweenRef.current = gsap.to(detail, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [activeId, expandedGroup]);

  return (
    <div
      ref={rootRef}
      className={[
        'tech-decks',
        expandedGroup ? 'tech-decks--expanded' : 'tech-decks--overview',
      ].join(' ')}
    >
      <div
        className="tech-decks-grid"
        aria-hidden={expandedGroup ? true : undefined}
      >
        {techGroupOrder.map((groupKey) => {
          const items = orderGroup(groupKey, leadByGroup[groupKey]);
          const lead = items[0];
          const trail = items.slice(1, 4);
          if (!lead) return null;
          return (
            <button
              key={groupKey}
              type="button"
              data-deck-col
              data-group={groupKey}
              className="tech-deck-col"
              onClick={() => expand(groupKey)}
              disabled={busy}
              aria-expanded={expandedGroup === groupKey}
              aria-label={t(`tech.groups.${groupKey}`)}
            >
              <span className="tech-deck-col-label" data-deck-label>
                {t(`tech.groups.${groupKey}`)}
              </span>

              <div className="tech-deck-pile" aria-hidden="true">
                <div className="tech-deck-card tech-deck-card--front" data-front>
                  <lead.Icon className="tech-deck-card-icon" />
                </div>

                {trail.length > 0 && (
                  <div className="tech-deck-trail">
                    {trail.map((card, i) => (
                      <div
                        key={card.id}
                        data-trail-card
                        className="tech-deck-card tech-deck-card--trail"
                        style={
                          {
                            ['--trail-i' as string]: String(i),
                          } as CSSProperties
                        }
                      >
                        <card.Icon className="tech-deck-card-icon" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {expandedGroup && activeTech && (
        <div className="tech-decks-focus">
          <button
            type="button"
            className="tech-decks-focus-group"
            onClick={collapse}
            disabled={busy}
            aria-label={t('tech.back', { defaultValue: 'All stacks' })}
          >
            <span aria-hidden="true" className="tech-decks-focus-group-arrow">
              ←
            </span>
            <span className="tech-decks-focus-group-text">
              {t(`tech.groups.${expandedGroup}`)}
            </span>
          </button>

          <div
            ref={fanRef}
            className="tech-fan"
            role="listbox"
            aria-label={t(`tech.groups.${expandedGroup}`)}
          >
            {expandedItems.map((item) => {
              const selected = item.id === activeId;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  aria-label={item.name}
                  data-fan-card
                  className={[
                    'tech-fan-card',
                    selected ? 'tech-fan-card--active' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => setActiveId(item.id)}
                >
                  <item.Icon
                    className="tech-fan-card-icon"
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>

          <div ref={detailRef} className="tech-deck-detail">
            <h3 className="tech-deck-detail-name">{activeTech.name}</h3>
            <p className="tech-deck-detail-fact">
              {t(`tech.facts.${activeTech.id}`)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
