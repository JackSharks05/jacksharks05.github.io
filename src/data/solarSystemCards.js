// Solar-system click cards
//
// - The Sun is configured as a direct link (no preview card).
// - Planets (and optionally the Moon) use the same card UI as constellations.
//
// Fields:
// - title: Heading shown in the preview card
// - fact: Short fun fact (1-2 sentences)
// - to:   Route for the link button
// - linkText: Optional label for the link button (defaults to "See more")
// - imageSrc: Optional image shown above the text inside the card
// - imageAlt: Optional alt text for the image
//
// Names must match `obj.name` from src/utils/solarSystem.js (e.g. "Mars").

export const sunLink = {
  to: "https://awu164.github.io/",
  linkText: "See more",
};

export const solarSystemCards = {
  Moon: {
    title: "Moon",
    fact: "I collect the Swatch x Omega Moonswatches. Don't ask how many I have; I don't want to think about how much I've spent on them.",
    to: "/thoughts",
    linkText: "See thoughts about timekeeping.",
  },
  Mercury: {
    title: "Mercury",
    fact: "I think Mercury (in Roman mythology) is quite the sidequester. My friends think I'm the most like him, out of all of the gods. I don't disagree.",
    to: "/about",
    linkText: "Learn more about my sidequesting",
  },
  Venus: {
    title: "Venus",
    fact: "Fun fact coming soon!",
    to: "/",
    linkText: "See more",
  },
  Mars: {
    title: "Mars",
    fact: "Fun fact coming soon!",
    to: "/",
    linkText: "See more",
  },
  Jupiter: {
    title: "Jupiter",
    fact: "I played \"Jupiter, bringer of Jollity\" (Holst's Planets) in the 2016 NY All County Music Festival, and it's still one of my favourites.",
    to: "/music",
    linkText: "See more about my music!",
  },
  Saturn: {
    title: "Saturn",
    fact: "Fun fact coming soon!",
    to: "/",
    linkText: "See more",
  },
  Uranus: {
    title: "Uranus",
    fact: "Uranus isn't visible by the naked eye, but I included it here as it's is one of my best friends' favourite planets: but not for the reason you may think. Shoutout Emma!",
    to: "https://www.emmazou.com",
    linkText: "Go see what she's up to!",
  },
  Neptune: {
    title: "Neptune",
    fact: "Neptune also isn't visible by the naked eye, but it's one of my best friend's favourite planets. Shoutout Yuyuan!",
    to: "https://www.yuyuanhuang.com",
    linkText: "Check our her awesome work!",
  },
};

export const getSolarSystemCard = (name) => {
  if (!name) return null;
  if (name === "Sun") return null;
  return solarSystemCards[name] || null;
};
