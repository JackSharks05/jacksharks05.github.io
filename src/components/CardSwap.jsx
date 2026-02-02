import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
} from "react";
import gsap from "gsap";
import "./CardSwap.css";

export const Card = forwardRef(function Card({ customClass, ...rest }, ref) {
  return (
    <div
      ref={ref}
      {...rest}
      className={`cardSwap__card ${customClass ?? ""} ${rest.className ?? ""}`.trim()}
    />
  );
});

const makeSlot = (i, distX, distY, total) => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
});

const placeNow = (el, slot, skew) => {
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: "center center",
    zIndex: slot.zIndex,
    force3D: true,
  });
};

const CardSwap = ({
  width = 250,
  height = 400,
  cardDistance = 0,
  verticalDistance = 0,
  delay = 15000,
  pauseOnHover = false,
  onCardClick,
  skewAmount = 0,
  easing = "elastic",
  mode = "stack", // 'stack' | 'list'
  children,
}) => {
  const config =
    easing === "elastic"
      ? {
          ease: "elastic.out(0.6,0.9)",
          durDrop: 2,
          durMove: 2,
          durReturn: 2,
          promoteOverlap: 0.9,
          returnDelay: 0.05,
        }
      : {
          ease: "power1.inOut",
          durDrop: 0.8,
          durMove: 0.8,
          durReturn: 0.8,
          promoteOverlap: 0.45,
          returnDelay: 0.2,
        };

  const childArr = useMemo(() => Children.toArray(children) || [], [children]);

  const refs = useMemo(
    () => childArr.map(() => React.createRef()),
    [childArr.length],
  );

  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));
  const tlRef = useRef(null);
  const intervalRef = useRef(0);
  const containerRef = useRef(null);
  const bringToFrontRef = useRef(null);

  useEffect(() => {
    if (mode === "list") return undefined;
    if (!childArr.length) return undefined;

    const total = refs.length;
    refs.forEach((r, i) => {
      if (r.current) {
        placeNow(
          r.current,
          makeSlot(i, cardDistance, verticalDistance, total),
          skewAmount,
        );
      }
    });

    const swap = () => {
      if (order.current.length < 2) return;

      const [front, ...rest] = order.current;
      const elFront = refs[front]?.current;
      if (!elFront) return;

      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.to(elFront, {
        y: "+=500",
        duration: config.durDrop,
        ease: config.ease,
      });

      tl.addLabel("promote", `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx]?.current;
        if (!el) return;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, "promote");
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease,
          },
          `promote+=${i * 0.15}`,
        );
      });

      const backSlot = makeSlot(
        refs.length - 1,
        cardDistance,
        verticalDistance,
        refs.length,
      );
      tl.addLabel("return", `promote+=${config.durMove * config.returnDelay}`);
      tl.call(
        () => {
          gsap.set(elFront, { zIndex: backSlot.zIndex });
        },
        undefined,
        "return",
      );
      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: config.durReturn,
          ease: config.ease,
        },
        "return",
      );

      tl.call(() => {
        order.current = [...rest, front];
      });
    };

    bringToFrontRef.current = (clickedIndex) => {
      const currentOrder = order.current;
      const position = currentOrder.indexOf(clickedIndex);
      if (position <= 0) return;

      const newOrder = [
        clickedIndex,
        ...currentOrder.filter((idx) => idx !== clickedIndex),
      ];
      order.current = newOrder;

      newOrder.forEach((idx, stackPos) => {
        const el = refs[idx]?.current;
        if (!el) return;
        const slot = makeSlot(
          stackPos,
          cardDistance,
          verticalDistance,
          refs.length,
        );
        gsap.set(el, { zIndex: slot.zIndex });
        gsap.to(el, {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          duration: config.durMove,
          ease: config.ease,
        });
      });
    };

    swap();
    intervalRef.current = window.setInterval(swap, delay);

    const node = containerRef.current;

    if (pauseOnHover && node) {
      const pause = () => {
        tlRef.current?.pause();
        window.clearInterval(intervalRef.current);
      };
      const resume = () => {
        tlRef.current?.play();
        intervalRef.current = window.setInterval(swap, delay);
      };
      node.addEventListener("mouseenter", pause);
      node.addEventListener("mouseleave", resume);
      return () => {
        node.removeEventListener("mouseenter", pause);
        node.removeEventListener("mouseleave", resume);
        window.clearInterval(intervalRef.current);
      };
    }

    return () => {
      window.clearInterval(intervalRef.current);
      bringToFrontRef.current = null;
    };
  }, [
    cardDistance,
    verticalDistance,
    delay,
    pauseOnHover,
    skewAmount,
    easing,
    childArr.length,
    refs,
    config.durDrop,
    config.durMove,
    config.durReturn,
    config.ease,
    config.promoteOverlap,
    config.returnDelay,
    mode,
  ]);

  const rendered = childArr.map((child, i) => {
    if (!isValidElement(child)) return child;

    return cloneElement(child, {
      key: i,
      ref: refs[i],
      style: { width, height, ...(child.props.style || {}) },
      onClick: (e) => {
        if (child.props.onClick) child.props.onClick(e);
        if (bringToFrontRef.current) bringToFrontRef.current(i);
        if (typeof onCardClick === "function") onCardClick(i);
      },
    });
  });

  const containerClass =
    mode === "list"
      ? "cardSwap__container cardSwap__container--list"
      : "cardSwap__container cardSwap__container--stack";

  return (
    <div
      ref={containerRef}
      className={containerClass}
      style={{ width, height }}
    >
      {rendered}
    </div>
  );
};

export default CardSwap;
