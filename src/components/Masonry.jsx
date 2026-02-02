import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import "./Masonry.css";

const useMedia = (queries, values, defaultValue) => {
  const get = () => {
    const index = queries.findIndex((q) => window.matchMedia(q).matches);
    return values[index] ?? defaultValue;
  };

  const [value, setValue] = useState(get);

  useEffect(() => {
    const handler = () => setValue(get());
    const mqs = queries.map((q) => window.matchMedia(q));
    mqs.forEach((mq) => mq.addEventListener("change", handler));
    return () => mqs.forEach((mq) => mq.removeEventListener("change", handler));
  }, [queries, values, defaultValue]);

  return value;
};

const useMeasure = () => {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return [ref, size];
};

const preloadImages = async (urls) => {
  await Promise.all(
    urls.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = img.onerror = () => resolve();
        }),
    ),
  );
};

const Masonry = ({
  items,
  ease = "power3.out",
  duration = 0.6,
  stagger = 0.05,
  animateFrom = "bottom",
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
  onItemClick,
}) => {
  const columns = useMedia(
    [
      "(min-width:1500px)",
      "(min-width:1000px)",
      "(min-width:600px)",
      "(min-width:400px)",
    ],
    [5, 4, 3, 2],
    1,
  );

  const [containerRef, { width }] = useMeasure();
  const [imagesReady, setImagesReady] = useState(false);
  const [measuredItems, setMeasuredItems] = useState(null);

  const getInitialPosition = (item) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return { x: item.x, y: item.y };

    let direction = animateFrom;

    if (animateFrom === "random") {
      const directions = ["top", "bottom", "left", "right"];
      direction = directions[Math.floor(Math.random() * directions.length)];
    }

    switch (direction) {
      case "top":
        return { x: item.x, y: -200 };
      case "bottom":
        return { x: item.x, y: window.innerHeight + 200 };
      case "left":
        return { x: -200, y: item.y };
      case "right":
        return { x: window.innerWidth + 200, y: item.y };
      case "center":
        return {
          x: containerRect.width / 2 - item.w / 2,
          y: containerRect.height / 2 - item.h / 2,
        };
      default:
        return { x: item.x, y: item.y + 100 };
    }
  };

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      await preloadImages(items.map((i) => i.img));

      const results = await Promise.all(
        items.map(
          (item) =>
            new Promise((resolve) => {
              const img = new Image();
              img.src = item.img;
              img.onload = () => {
                const ratio =
                  img.naturalWidth > 0
                    ? img.naturalHeight / img.naturalWidth
                    : 1.2;
                resolve({ id: item.id, ratio });
              };
              img.onerror = () => {
                resolve({ id: item.id, ratio: 1.2 });
              };
            }),
        ),
      );

      if (cancelled) return;

      const withRatios = items.map((item) => {
        const found = results.find((r) => r.id === item.id);
        return { ...item, _ratio: found?.ratio ?? 1.2 };
      });

      setMeasuredItems(withRatios);
      setImagesReady(true);
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [items]);

  const grid = useMemo(() => {
    if (!width || !measuredItems) return [];

    const colHeights = new Array(columns).fill(0);
    const columnWidth = width / columns;

    const source = measuredItems;

    return source.map((child) => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = columnWidth * col;
      const ratio = child._ratio ?? 1.2;
      const height = columnWidth * ratio;
      const y = colHeights[col];

      colHeights[col] += height;

      return { ...child, x, y, w: columnWidth, h: height };
    });
  }, [columns, measuredItems, width]);

  const hasMounted = useRef(false);

  useLayoutEffect(() => {
    if (!imagesReady || !grid.length) return;

    grid.forEach((item, index) => {
      const selector = `[data-key="${item.id}"]`;
      const animationProps = {
        x: item.x,
        y: item.y,
        width: item.w,
        height: item.h,
      };

      if (!hasMounted.current) {
        const initialPos = getInitialPosition(item);
        const initialState = {
          opacity: 0,
          x: initialPos.x,
          y: initialPos.y,
          width: item.w,
          height: item.h,
          ...(blurToFocus && { filter: "blur(10px)" }),
        };

        gsap.fromTo(selector, initialState, {
          opacity: 1,
          ...animationProps,
          ...(blurToFocus && { filter: "blur(0px)" }),
          duration: 0.8,
          ease: "power3.out",
          delay: index * stagger,
        });
      } else {
        gsap.to(selector, {
          ...animationProps,
          duration,
          ease,
          overwrite: "auto",
        });
      }
    });

    const maxHeight = grid.reduce(
      (acc, item) => Math.max(acc, item.y + item.h),
      0,
    );
    if (containerRef.current) {
      containerRef.current.style.height = `${maxHeight}px`;
    }

    hasMounted.current = true;
  }, [
    grid,
    imagesReady,
    stagger,
    animateFrom,
    blurToFocus,
    duration,
    ease,
    containerRef,
  ]);

  const handleMouseEnter = (e, item) => {
    const element = e.currentTarget;
    const selector = `[data-key="${item.id}"]`;

    if (scaleOnHover) {
      gsap.to(selector, {
        scale: hoverScale,
        duration: 0.3,
        ease: "power2.out",
      });
    }

    if (colorShiftOnHover) {
      const overlay = element.querySelector(".color-overlay");
      if (overlay) {
        gsap.to(overlay, {
          opacity: 0.3,
          duration: 0.3,
        });
      }
    }
  };

  const handleMouseLeave = (e, item) => {
    const element = e.currentTarget;
    const selector = `[data-key="${item.id}"]`;

    if (scaleOnHover) {
      gsap.to(selector, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    }

    if (colorShiftOnHover) {
      const overlay = element.querySelector(".color-overlay");
      if (overlay) {
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.3,
        });
      }
    }
  };

  return (
    <div ref={containerRef} className="masonry__list">
      {grid.map((item) => (
        <div
          key={item.id}
          data-key={item.id}
          className="masonry__itemWrapper"
          onClick={() => {
            if (typeof onItemClick === "function") {
              onItemClick(item);
            } else if (item.url) {
              window.open(item.url, "_blank", "noopener");
            }
          }}
          onMouseEnter={(e) => handleMouseEnter(e, item)}
          onMouseLeave={(e) => handleMouseLeave(e, item)}
        >
          <div
            className="masonry__itemImg"
            style={{ backgroundImage: `url(${item.img})` }}
          >
            {colorShiftOnHover && <div className="color-overlay" />}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Masonry;
