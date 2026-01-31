import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { gsap } from "gsap";
import "./CardNav.css";

const slugify = (s) =>
  String(s || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const easeToCubicBezier = (ease) => {
  switch (ease) {
    case "power3.out":
      return "cubic-bezier(0.22, 1, 0.36, 1)";
    case "power2.out":
      return "cubic-bezier(0.2, 0.9, 0.2, 1)";
    case "expo.out":
      return "cubic-bezier(0.16, 1, 0.3, 1)";
    default:
      return "cubic-bezier(0.2, 0.8, 0.2, 1)";
  }
};

/**
 * CardNav
 * Props match the example API you shared:
 * - logo, logoAlt
 * - items: [{ label, bgColor, textColor, to?, links?: [{ label, ariaLabel, to?, href? }] }]
 * - baseColor, menuColor, buttonBgColor, buttonTextColor, ease, theme
 */
export default function CardNav({
  logo,
  logoAlt = "Logo",
  items = [],
  className = "",
  baseColor = "#fff",
  menuColor = "#000",
  buttonBgColor = "#111",
  buttonTextColor = "#fff",
  ease = "power3.out",
  theme = "dark",
  expanded = false,
  collapsedHeight = 0,
}) {
  const [isVisible, setIsVisible] = useState(expanded);
  const navRef = useRef(null);
  const cardsRef = useRef([]);
  const tlRef = useRef(null);

  const cssVars = useMemo(
    () => ({
      "--cn-base": baseColor,
      "--cn-menu": menuColor,
      "--cn-btn-bg": buttonBgColor,
      "--cn-btn-fg": buttonTextColor,
      "--cn-ease": easeToCubicBezier(ease),
    }),
    [baseColor, buttonBgColor, buttonTextColor, ease, menuColor],
  );

  const normalizedItems = useMemo(() => {
    return (items || []).map((item) => {
      const route = item.to || `/${slugify(item.label)}`;
      const links = (item.links || []).map((lnk) => {
        const hash = slugify(lnk.label);
        const to =
          lnk.to || (lnk.href ? null : `${route}${hash ? `#${hash}` : ""}`);
        return { ...lnk, to };
      });
      return { ...item, to: route, links };
    });
  }, [items]);

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 260;

    const contentEl = navEl.querySelector(".card-nav-content");
    if (!contentEl) return 260;

    const wasVisibility = contentEl.style.visibility;
    const wasPointerEvents = contentEl.style.pointerEvents;
    const wasPosition = contentEl.style.position;
    const wasHeight = contentEl.style.height;

    contentEl.style.visibility = "visible";
    contentEl.style.pointerEvents = "auto";
    contentEl.style.position = "static";
    contentEl.style.height = "auto";

    // force a reflow so scrollHeight is accurate
    // eslint-disable-next-line no-unused-expressions
    contentEl.offsetHeight;

    const topBar = Number.isFinite(collapsedHeight) ? collapsedHeight : 0;
    const padding = 16;
    const contentHeight = contentEl.scrollHeight;

    contentEl.style.visibility = wasVisibility;
    contentEl.style.pointerEvents = wasPointerEvents;
    contentEl.style.position = wasPosition;
    contentEl.style.height = wasHeight;

    return topBar + contentHeight + padding;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, {
      height: collapsedHeight,
      overflow: "hidden",
      opacity: 0,
      pointerEvents: "none",
    });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });
    tl.to(
      navEl,
      {
        opacity: 1,
        duration: 0.16,
        ease,
        onStart: () => {
          gsap.set(navEl, { pointerEvents: "auto" });
        },
      },
      0,
    );
    tl.to(
      navEl,
      {
        height: calculateHeight,
        duration: 0.4,
        ease,
      },
      0,
    );
    tl.to(
      cardsRef.current,
      { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 },
      "-=0.1",
    );
    return tl;
  };

  useLayoutEffect(() => {
    if (!isVisible) return;

    const tl = createTimeline();
    tlRef.current = tl;

    // If we're already supposed to be open when we mount (e.g. first open), play now.
    if (expanded && tl) {
      tl.progress(0);
      tl.play(0);
    }

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
  }, [ease, items, collapsedHeight, isVisible]);

  useLayoutEffect(() => {
    if (expanded) {
      setIsVisible(true);
    } else {
      const tl = tlRef.current;
      if (!tl) {
        setIsVisible(false);
        return;
      }

      tl.eventCallback("onReverseComplete", () => {
        if (navRef.current) {
          gsap.set(navRef.current, { pointerEvents: "none" });
        }
        setIsVisible(false);
      });

      tl.reverse();
    }
  }, [expanded]);

  useLayoutEffect(() => {
    if (!isVisible) return;

    const handleResize = () => {
      if (!tlRef.current) return;

      if (expanded) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });

        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          tlRef.current = newTl;
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [expanded, collapsedHeight, isVisible]);

  useLayoutEffect(() => {
    if (!isVisible) return;
    const tl = tlRef.current;
    if (!tl) return;

    if (expanded) {
      // Ensure we start from collapsed each time we open.
      tl.eventCallback("onReverseComplete", null);
      tl.progress(0);
      tl.play(0);
    }
  }, [expanded, isVisible]);

  const setCardRef = (i) => (el) => {
    if (el) cardsRef.current[i] = el;
  };

  if (!isVisible) return null;

  return (
    <div
      className={`card-nav-container ${className} ${theme === "light" ? "is-light" : ""}`}
      style={cssVars}
    >
      <nav
        ref={navRef}
        className={`card-nav ${expanded ? "open" : ""}`}
        style={{ backgroundColor: baseColor }}
      >
        <div className="card-nav-content" aria-hidden={!expanded}>
          {(normalizedItems || []).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="nav-card"
              ref={setCardRef(idx)}
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
            >
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  isActive ? "nav-card-label is-active" : "nav-card-label"
                }
              >
                {item.label}
              </NavLink>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}
