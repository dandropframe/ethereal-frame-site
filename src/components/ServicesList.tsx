import { useEffect, useRef } from "react";

type ServicesListProps = {
  services: readonly string[];
  className?: string;
};

type Letter = { element: HTMLElement; width: number; x: number; nextX: number };
type Item = {
  element: HTMLLIElement;
  text: HTMLElement;
  ghost: HTMLElement;
  letters: Letter[];
  sized: boolean;
  timers: Set<ReturnType<typeof setTimeout>>;
};
type Fragment = {
  x: number; y: number; w: number; h: number;
  vx: number; life: number; max: number; color: string;
};

export function ServicesList({ services, className = "" }: ServicesListProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!list || !canvas || !ctx) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = motion.matches;
    let disposed = false;
    let width = 0;
    let height = 0;
    let frame: number | null = null;
    let hovered: Item | null = null;
    let fragments: Fragment[] = [];
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const random = (a: number, b: number) => a + Math.random() * (b - a);
    const items: Item[] = Array.from(list.querySelectorAll("li")).flatMap((element) => {
      const text = element.querySelector<HTMLElement>(".services-text");
      const ghost = element.querySelector<HTMLElement>(".services-ghost");
      if (!text || !ghost) return [];
      return [{ element, text, ghost, sized: false, timers: new Set<ReturnType<typeof setTimeout>>(),
        letters: Array.from(text.children).map((child) => ({
          element: child as HTMLElement, width: 0, x: 0, nextX: 0,
        })),
      }];
    });

    function schedule(fn: () => void, ms: number, item?: Item) {
      const timer = setTimeout(() => {
        timers.delete(timer);
        item?.timers.delete(timer);
        if (!disposed) fn();
      }, ms);
      timers.add(timer);
      item?.timers.add(timer);
    }
    function clearItem(item: Item) {
      item.timers.forEach((timer) => { clearTimeout(timer); timers.delete(timer); });
      item.timers.clear();
    }
    function restore(item: Item) {
      item.letters.forEach(({ element }) => {
        element.style.transform = "";
        element.style.opacity = "";
      });
    }
    function size() {
      if (!canvas || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      items.forEach((item) => { item.sized = false; });
    }
    function measure(item: Item) {
      if (item.sized) return;
      item.letters.forEach(({ element }) => { element.style.width = ""; });
      item.letters.forEach((letter) => {
        letter.width = letter.element.getBoundingClientRect().width;
        letter.x = letter.element.offsetLeft;
      });
      item.letters.forEach(({ element, width }) => { element.style.width = `${width}px`; });
      item.sized = true;
    }
    function reorder(item: Item): [number, number] {
      const n = item.letters.length;
      const length = Math.random() < .18 ? n : Math.min(n, 3 + Math.floor(Math.random() * 4));
      const start = Math.floor(Math.random() * (n - length + 1));
      const run = item.letters.slice(start, start + length);
      const order = run.slice();
      let tries = 0;
      do {
        for (let i = order.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [order[i], order[j]] = [order[j], order[i]];
        }
      } while (order.every((letter, i) => letter === run[i]) && ++tries < 6);
      const first = run[0];
      const last = run[run.length - 1];
      if (!first || !last) return [0, 0];
      let x = first.x;
      order.forEach((letter) => { letter.nextX = x; x += letter.width; });
      run.forEach((letter) => {
        letter.element.style.transform = `translateX(${(letter.nextX - letter.x).toFixed(2)}px)`;
        letter.element.style.opacity = Math.random() < .3 ? ".55" : "1";
      });
      return [first.element.getBoundingClientRect().left, last.element.getBoundingClientRect().right];
    }
    function slice(item: Item) {
      const a = random(5, 28), h = random(2, 8), dx = random(-8, 8);
      item.ghost.style.clipPath = `inset(${a.toFixed(1)}px 0 ${(40 - a - h).toFixed(1)}px 0)`;
      item.ghost.style.transform = `translateX(${dx.toFixed(1)}px)`;
      item.ghost.style.opacity = "1";
      schedule(() => { item.ghost.style.opacity = "0"; }, random(40, 80), item);
    }
    function loop() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (let i = fragments.length - 1; i >= 0; i--) {
        const part = fragments[i];
        part.life++;
        const k = part.life / part.max;
        if (k >= 1) { fragments.splice(i, 1); continue; }
        if (part.life % 3 === 0) {
          part.x += part.vx; part.vx *= .6;
          if (Math.random() < .12) part.w = random(2, 12);
        }
        if (Math.random() > k * .85) {
          ctx.globalAlpha = Math.random() < .25 ? .35 : .8;
          ctx.fillStyle = part.color;
          ctx.fillRect(Math.round(part.x), Math.round(part.y), part.w, part.h);
        }
      }
      ctx.globalAlpha = 1;
      frame = fragments.length || hovered ? requestAnimationFrame(loop) : null;
    }
    function emit(item: Item, count: number, x0?: number, x1?: number) {
      if (reduced) return;
      const rect = item.text.getBoundingClientRect();
      const color = getComputedStyle(item.element).color;
      for (let i = 0; i < count; i++) {
        fragments.push({ x: random(x0 ?? rect.left - 4, x1 ?? rect.right),
          y: rect.top + random(8, rect.height - 4),
          w: Math.random() < .8 ? random(3, 14) : random(1, 2),
          h: Math.random() < .85 ? 1 : 2,
          vx: (Math.random() < .5 ? -1 : 1) * random(1, 5),
          life: 0, max: random(16, 44), color,
        });
      }
      if (frame === null) frame = requestAnimationFrame(loop);
    }
    function later(item: Item, fn: () => void, ms: number) {
      schedule(() => { if (hovered === item && !reduced) fn(); }, ms, item);
    }
    function glitch(item: Item) {
      if (reduced || !item.letters.length) return;
      measure(item);
      const span = reorder(item); slice(item); emit(item, 6, ...span);
      later(item, () => {
        if (Math.random() < .4) {
          restore(item);
          const second = reorder(item); slice(item); emit(item, 4, ...second);
          later(item, () => {
            restore(item); later(item, () => glitch(item), random(500, 1300));
          }, random(80, 200));
        } else {
          restore(item); later(item, () => glitch(item), random(500, 1300));
        }
      }, random(100, 260));
    }
    const detach = items.map((item) => {
      const enter = () => {
        hovered = item;
        measure(item);
        item.element.classList.add("services-on");
        list.classList.add("services-hot");
        glitch(item);
      };
      const leave = () => {
        if (hovered === item) hovered = null;
        clearItem(item);
        item.element.classList.remove("services-on");
        restore(item); item.ghost.style.opacity = "0";
        schedule(() => { if (!hovered) list.classList.remove("services-hot"); }, 30);
        emit(item, 4);
      };
      item.element.addEventListener("pointerenter", enter);
      item.element.addEventListener("pointerleave", leave);
      return () => {
        item.element.removeEventListener("pointerenter", enter);
        item.element.removeEventListener("pointerleave", leave);
      };
    });
    function motionChanged() {
      reduced = motion.matches;
      items.forEach((item) => { clearItem(item); restore(item); item.ghost.style.opacity = "0"; });
      fragments = [];
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      ctx?.clearRect(0, 0, width, height);
      if (!reduced && hovered) glitch(hovered);
    }
    size();
    window.addEventListener("resize", size);
    motion.addEventListener("change", motionChanged);
    void document.fonts.ready.then(() => {
      if (!disposed) items.forEach((item) => { item.sized = false; });
    });
    return () => {
      disposed = true;
      detach.forEach((fn) => fn());
      window.removeEventListener("resize", size);
      motion.removeEventListener("change", motionChanged);
      timers.forEach(clearTimeout);
      if (frame !== null) cancelAnimationFrame(frame);
      ctx.clearRect(0, 0, width, height);
      list.classList.remove("services-hot");
      items.forEach((item) => {
        restore(item); item.element.classList.remove("services-on");
        item.ghost.style.opacity = "0";
        item.letters.forEach(({ element }) => { element.style.width = ""; });
      });
    };
  }, [services]);

  return (
    <>
      <ul ref={listRef} className={`services-list ${className}`}>
        {services.map((service, index) => (
          <li key={`${index}-${service}`} aria-label={service}>
            <span className="services-text" aria-hidden="true">
              {Array.from(service).map((letter, i) => <span className="services-char" key={i}>{letter}</span>)}
            </span>
            <span className="services-ghost" aria-hidden="true">{service}</span>
          </li>
        ))}
      </ul>
      <canvas ref={canvasRef} className="services-fx" aria-hidden="true" />
    </>
  );
}