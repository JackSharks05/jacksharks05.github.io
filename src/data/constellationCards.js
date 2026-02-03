// Constellation "about me" cards
//
// This is the single place to author all 88 constellation cards.
// Each key must match the IAU abbreviation used by the Stellarium stick-figure
// dataset (see src/data/constellationLines.js).
//
// Fields:
// - title: Heading shown in the preview card
// - fact: Short fun fact (1-2 sentences)
// - to:   Route for the link button
// - linkText: Optional label for the link button (defaults to "See more")
//
// Tip: You can point multiple constellations at the same section.

export const constellationCards = {
  And: { title: "Andromeda", fact: "(Add a fun fact here)", to: "/about" },
  Ant: { title: "Antlia", fact: "(Add a fun fact here)", to: "/projects" },
  Aps: { title: "Apus", fact: "(Add a fun fact here)", to: "/projects" },
  Aql: { title: "Aquila", fact: "(Add a fun fact here)", to: "/thoughts" },
  Aqr: { title: "Aquarius", fact: "(Add a fun fact here)", to: "/research" },
  Ara: { title: "Ara", fact: "(Add a fun fact here)", to: "/projects" },
  Ari: {
    title: "Aries",
    fact: "I am an Aries! Do with that what you will.",
    to: "/projects",
    linkText: "More about me!",
  },
  Aur: { title: "Auriga", fact: "(Add a fun fact here)", to: "/projects" },
  Boo: { title: "Boötes", fact: "(Add a fun fact here)", to: "/resume" },
  CMa: { title: "Canis Major", fact: "(Add a fun fact here)", to: "/projects" },
  CMi: { title: "Canis Minor", fact: "(Add a fun fact here)", to: "/projects" },
  CVn: {
    title: "Canes Venatici",
    fact: "(Add a fun fact here)",
    to: "/projects",
  },
  Cae: { title: "Caelum", fact: "(Add a fun fact here)", to: "/projects" },
  Cam: { title: "Camelopardalis", fact: "(Add a fun fact here)", to: "/about" },
  Cap: { title: "Capricornus", fact: "(Add a fun fact here)", to: "/resume" },
  Car: { title: "Carina", fact: "(Add a fun fact here)", to: "/projects" },
  Cas: { title: "Cassiopeia", fact: "(Add a fun fact here)", to: "/research" },
  Cen: { title: "Centaurus", fact: "(Add a fun fact here)", to: "/projects" },
  Cep: { title: "Cepheus", fact: "(Add a fun fact here)", to: "/about" },
  Cet: { title: "Cetus", fact: "(Add a fun fact here)", to: "/projects" },
  Cha: { title: "Chamaeleon", fact: "(Add a fun fact here)", to: "/projects" },
  Cir: { title: "Circinus", fact: "(Add a fun fact here)", to: "/projects" },
  Cnc: { title: "Cancer", fact: "(Add a fun fact here)", to: "/about" },
  Col: { title: "Columba", fact: "(Add a fun fact here)", to: "/projects" },
  Com: {
    title: "Coma Berenices",
    fact: "(Add a fun fact here)",
    to: "/research",
  },
  CrA: {
    title: "Corona Australis",
    fact: "(Add a fun fact here)",
    to: "/projects",
  },
  CrB: {
    title: "Corona Borealis",
    fact: "(Add a fun fact here)",
    to: "/projects",
  },
  Crt: { title: "Crater", fact: "(Add a fun fact here)", to: "/projects" },
  Cru: { title: "Crux", fact: "(Add a fun fact here)", to: "/projects" },
  Crv: { title: "Corvus", fact: "(Add a fun fact here)", to: "/thoughts" },
  Cyg: { title: "Cygnus", fact: "(Add a fun fact here)", to: "/music" },
  Del: { title: "Delphinus", fact: "(Add a fun fact here)", to: "/projects" },
  Dor: { title: "Dorado", fact: "(Add a fun fact here)", to: "/projects" },
  Dra: { title: "Draco", fact: "(Add a fun fact here)", to: "/about" },
  Equ: { title: "Equuleus", fact: "(Add a fun fact here)", to: "/projects" },
  Eri: { title: "Eridanus", fact: "(Add a fun fact here)", to: "/thoughts" },
  For: { title: "Fornax", fact: "(Add a fun fact here)", to: "/research" },
  Gem: {
    title: "Gemini",
    fact: "Despite what many think, my younger brother and I are not twins. However, we are incredibly close, and he is one of the most brilliant people I know.",
    to: "https://person.rdh540.dev/",
    linkText: "Go check him out!",
  },
  Gru: { title: "Grus", fact: "(Add a fun fact here)", to: "/projects" },
  Her: { title: "Hercules", fact: "(Add a fun fact here)", to: "/projects" },
  Hor: {
    title: "Horologium",
    fact: "I love watches and timekeeping.",
    to: "/about",
    linkText: "read about why!",
  },
  Hya: { title: "Hydra", fact: "(Add a fun fact here)", to: "/projects" },
  Hyi: { title: "Hydrus", fact: "(Add a fun fact here)", to: "/projects" },
  Ind: { title: "Indus", fact: "(Add a fun fact here)", to: "/projects" },
  LMi: { title: "Leo Minor", fact: "(Add a fun fact here)", to: "/projects" },
  Lac: { title: "Lacerta", fact: "(Add a fun fact here)", to: "/projects" },
  Leo: { title: "Leo", fact: "(Add a fun fact here)", to: "/projects" },
  Lep: { title: "Lepus", fact: "(Add a fun fact here)", to: "/projects" },
  Lib: { title: "Libra", fact: "(Add a fun fact here)", to: "/resume" },
  Lup: { title: "Lupus", fact: "(Add a fun fact here)", to: "/projects" },
  Lyn: { title: "Lynx", fact: "(Add a fun fact here)", to: "/projects" },
  Lyr: { title: "Lyra", fact: "(Add a fun fact here)", to: "/music" },
  Men: { title: "Mensa", fact: "(Add a fun fact here)", to: "/projects" },
  Mic: {
    title: "Microscopium",
    fact: "(Add a fun fact here)",
    to: "/research",
  },
  Mon: { title: "Monoceros", fact: "(Add a fun fact here)", to: "/projects" },
  Mus: { title: "Musca", fact: "(Add a fun fact here)", to: "/music" },
  Nor: { title: "Norma", fact: "(Add a fun fact here)", to: "/projects" },
  Oct: { title: "Octans", fact: "(Add a fun fact here)", to: "/about" },
  Oph: { title: "Ophiuchus", fact: "(Add a fun fact here)", to: "/research" },
  Ori: {
    title: "Orion",
    fact: "I love taking photos, especially of the stars. One of my best photos was of Orion!",
    to: "/photography-videography",
    linkText: "Take a look!",
  },
  Pav: { title: "Pavo", fact: "(Add a fun fact here)", to: "/projects" },
  Peg: {
    title: "Pegasus",
    fact: 'One of my favorite Spanish podcasts is "Caso 63" (produced around CoVID) which tells of a virus named "Pegasus". Highly recommend!',
    to: "/about",
    linkText: "read more about my langauge experiences!",
  },
  Per: { title: "Perseus", fact: "(Add a fun fact here)", to: "/projects" },
  Phe: { title: "Phoenix", fact: "(Add a fun fact here)", to: "/about" },
  Pic: { title: "Pictor", fact: "(Add a fun fact here)", to: "/projects" },
  PsA: {
    title: "Piscis Austrinus",
    fact: "(Add a fun fact here)",
    to: "/projects",
  },
  Psc: { title: "Pisces", fact: "(Add a fun fact here)", to: "/projects" },
  Pup: { title: "Puppis", fact: "(Add a fun fact here)", to: "/projects" },
  Pyx: { title: "Pyxis", fact: "(Add a fun fact here)", to: "/projects" },
  Ret: { title: "Reticulum", fact: "(Add a fun fact here)", to: "/projects" },
  Scl: { title: "Sculptor", fact: "(Add a fun fact here)", to: "/projects" },
  Sco: { title: "Scorpius", fact: "(Add a fun fact here)", to: "/projects" },
  Sct: { title: "Scutum", fact: "(Add a fun fact here)", to: "/projects" },
  Ser: { title: "Serpens", fact: "(Add a fun fact here)", to: "/research" },
  Sex: { title: "Sextans", fact: "(Add a fun fact here)", to: "/projects" },
  Sge: { title: "Sagitta", fact: "(Add a fun fact here)", to: "/projects" },
  Sgr: { title: "Sagittarius", fact: "(Add a fun fact here)", to: "/projects" },
  Tau: { title: "Taurus", fact: "(Add a fun fact here)", to: "/projects" },
  Tel: { title: "Telescopium", fact: "(Add a fun fact here)", to: "/research" },
  Tra: {
    title: "Triangulum Australe",
    fact: "(Add a fun fact here)",
    to: "/projects",
  },
  Tri: { title: "Triangulum", fact: "(Add a fun fact here)", to: "/projects" },
  Tuc: { title: "Tucana", fact: "(Add a fun fact here)", to: "/projects" },
  UMa: {
    title: "Ursa Major",
    fact: "I work as a ski coach in Stratton Mountain, and one of their chairlifts is called Ursa Express! (It's not my favourite though...)",
    to: "/resume",
    linkText: "Read about my work experience!",
  },
  UMi: { title: "Ursa Minor", fact: "(Add a fun fact here)", to: "/about" },
  Vel: { title: "Vela", fact: "(Add a fun fact here)", to: "/projects" },
  Vir: { title: "Virgo", fact: "(Add a fun fact here)", to: "/projects" },
  Vol: { title: "Volans", fact: "(Add a fun fact here)", to: "/projects" },
  Vul: { title: "Vulpecula", fact: "(Add a fun fact here)", to: "/projects" },
};

export const getConstellationCard = (key, fallbackTitle = "") => {
  const entry = constellationCards[key];
  if (entry) return entry;
  return {
    title: fallbackTitle || key || "Constellation",
    fact: "You shouldn't be seeing this!",
    to: "/error",
    linkText: "Come here!",
  };
};
