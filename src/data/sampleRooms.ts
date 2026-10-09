import { SampleRoom } from '../types';

// Helper to convert SVG string to base64 data URI
function svgToDataUri(svg: string): string {
  if (typeof window !== 'undefined') {
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
  }
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const kitchenSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2a2e3d"/>
      <stop offset="100%" stop-color="#1e2230"/>
    </linearGradient>
    <linearGradient id="counterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#474f63"/>
      <stop offset="100%" stop-color="#353b4c"/>
    </linearGradient>
    <linearGradient id="sinkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1c1f28"/>
      <stop offset="100%" stop-color="#282d3b"/>
    </linearGradient>
  </defs>

  <!-- Kitchen Background & Backsplash -->
  <rect width="800" height="600" fill="url(#wallGrad)"/>
  <rect x="0" y="180" width="800" height="120" fill="#242838"/>
  <path d="M0,240 L800,240 M0,200 L800,200 M0,280 L800,280" stroke="#31374a" stroke-width="2"/>

  <!-- Upper Cabinets -->
  <rect x="40" y="20" width="320" height="140" fill="#181a24" stroke="#373d52" stroke-width="2"/>
  <rect x="440" y="20" width="320" height="140" fill="#181a24" stroke="#373d52" stroke-width="2"/>
  <line x1="200" y1="20" x2="200" y2="160" stroke="#373d52" stroke-width="2"/>
  <line x1="600" y1="20" x2="600" y2="160" stroke="#373d52" stroke-width="2"/>

  <!-- Kitchen Countertop -->
  <polygon points="0,320 800,320 800,600 0,600" fill="url(#counterGrad)"/>
  <line x1="0" y1="320" x2="800" y2="320" stroke="#606982" stroke-width="6"/>

  <!-- Sink Basin -->
  <rect x="260" y="350" width="280" height="180" rx="12" fill="url(#sinkGrad)" stroke="#525b73" stroke-width="3"/>
  <circle cx="400" cy="450" r="18" fill="#12141a" stroke="#41485c" stroke-width="2"/>
  <!-- Faucet -->
  <path d="M400,340 Q400,280 430,290" fill="none" stroke="#94a3b8" stroke-width="8" stroke-linecap="round"/>
  
  <!-- CLUTTER ITEMS: Dishes in sink -->
  <ellipse cx="370" cy="440" rx="42" ry="24" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
  <ellipse cx="365" cy="435" rx="36" ry="18" fill="#cbd5e1" stroke="#94a3b8" stroke-width="2"/>
  <ellipse cx="430" cy="460" rx="38" ry="22" fill="#fed7aa" stroke="#f97316" stroke-width="2"/>
  <rect x="330" y="410" width="25" height="40" rx="4" fill="#67e8f9" stroke="#0891b2" stroke-width="2"/>
  <line x1="320" y1="460" x2="350" y2="430" stroke="#cbd5e1" stroke-width="4" stroke-linecap="round"/>
  <line x1="440" y1="440" x2="470" y2="420" stroke="#cbd5e1" stroke-width="4" stroke-linecap="round"/>

  <!-- CLUTTER ITEMS: Left Counter (Cans, Box, Crumbs) -->
  <rect x="80" y="270" width="70" height="110" rx="3" fill="#ef4444" stroke="#991b1b" stroke-width="2"/>
  <text x="92" y="325" fill="#ffffff" font-size="12" font-family="sans-serif" font-weight="bold">CEREAL</text>
  <rect x="170" y="330" width="30" height="45" rx="5" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/>
  <rect x="190" y="340" width="30" height="45" rx="5" fill="#10b981" stroke="#047857" stroke-width="2"/>
  <ellipse cx="120" cy="400" rx="35" ry="15" fill="#e0e7ff" opacity="0.6"/>
  <!-- Crumbs & Trash -->
  <circle cx="160" cy="420" r="4" fill="#f59e0b"/>
  <circle cx="175" cy="415" r="3" fill="#f59e0b"/>
  <circle cx="150" cy="435" r="5" fill="#f59e0b"/>
  <rect x="70" y="430" width="55" height="35" fill="#fef08a" stroke="#ca8a04" stroke-width="1" transform="rotate(-15 70 430)"/>

  <!-- CLUTTER ITEMS: Right Counter (Mugs, Cutting board, Wrappers) -->
  <rect x="580" y="350" width="160" height="100" rx="8" fill="#78350f" stroke="#451a03" stroke-width="2"/>
  <ellipse cx="660" cy="380" rx="22" ry="16" fill="#f43f5e" stroke="#be123c" stroke-width="2"/>
  <rect x="610" y="390" width="40" height="30" rx="4" fill="#a855f7" stroke="#7e22ce" stroke-width="2"/>
  <rect x="690" y="420" width="60" height="25" rx="2" fill="#e2e8f0" stroke="#64748b" stroke-width="1" transform="rotate(10 690 420)"/>
  <path d="M570,470 Q600,455 640,480" stroke="#f43f5e" stroke-width="8" stroke-linecap="round" fill="none"/>
</svg>
`;

const bedroomSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="bedWall" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e1b2e"/>
      <stop offset="100%" stop-color="#13111f"/>
    </linearGradient>
    <linearGradient id="floorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2d283e"/>
      <stop offset="100%" stop-color="#1f1b2c"/>
    </linearGradient>
  </defs>

  <!-- Bedroom Wall -->
  <rect width="800" height="600" fill="url(#bedWall)"/>
  <!-- Floor line -->
  <polygon points="0,380 800,380 800,600 0,600" fill="url(#floorGrad)"/>
  <line x1="0" y1="380" x2="800" y2="380" stroke="#433b5c" stroke-width="4"/>

  <!-- Bed Frame -->
  <rect x="180" y="240" width="480" height="240" rx="8" fill="#1b172a" stroke="#4b4166" stroke-width="3"/>
  <!-- Unmade Mattress & Disheveled Duvet -->
  <rect x="190" y="260" width="460" height="210" rx="6" fill="#f8fafc"/>
  <path d="M220,330 C300,310 380,360 480,320 C560,350 630,310 640,430 C640,460 210,470 200,430 Z" fill="#6366f1" opacity="0.9"/>
  <!-- Tangled Blanket folds -->
  <path d="M260,370 Q350,340 440,390 T610,380" stroke="#4338ca" stroke-width="8" fill="none" stroke-linecap="round"/>
  <!-- Crumpled Pillows -->
  <rect x="220" y="270" width="120" height="70" rx="14" fill="#e0e7ff" transform="rotate(-8 220 270)"/>
  <rect x="380" y="275" width="130" height="70" rx="14" fill="#c7d2fe" transform="rotate(12 380 275)"/>

  <!-- CLOTHES CHAIR / MOUNTAIN (Right) -->
  <rect x="660" y="290" width="90" height="170" rx="4" fill="#2d2442" stroke="#5b4b80" stroke-width="2"/>
  <!-- Mountain of Clothes -->
  <path d="M640,380 C630,310 680,280 720,290 C760,300 780,350 770,410 C750,440 650,430 640,380 Z" fill="#ec4899"/>
  <path d="M650,350 Q710,330 760,360" stroke="#be185d" stroke-width="6" fill="none"/>
  <rect x="660" y="370" width="80" height="40" rx="8" fill="#3b82f6" transform="rotate(-15 660 370)"/>
  <rect x="670" y="400" width="90" height="50" rx="8" fill="#10b981" transform="rotate(8 670 400)"/>

  <!-- FLOOR CLUTTER (Laundry, Shoes, Water glass) -->
  <!-- Shoes -->
  <rect x="120" y="470" width="55" height="28" rx="8" fill="#0f172a" stroke="#475569" stroke-width="2" transform="rotate(20 120 470)"/>
  <rect x="180" y="490" width="55" height="28" rx="8" fill="#0f172a" stroke="#475569" stroke-width="2" transform="rotate(-10 180 490)"/>
  <!-- Socks on floor -->
  <ellipse cx="320" cy="510" rx="28" ry="14" fill="#f59e0b" transform="rotate(35 320 510)"/>
  <ellipse cx="440" cy="530" rx="26" ry="12" fill="#f59e0b" transform="rotate(-25 440 530)"/>
  <!-- Water glass on floor -->
  <rect x="520" y="480" width="22" height="35" rx="3" fill="#67e8f9" opacity="0.8" stroke="#0891b2" stroke-width="2"/>
  <!-- Open book -->
  <polygon points="60,490 100,505 140,490 100,480" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2"/>
</svg>
`;

const deskSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="officeWall" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#141724"/>
      <stop offset="100%" stop-color="#0e101a"/>
    </linearGradient>
    <linearGradient id="deskWood" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2c3040"/>
      <stop offset="100%" stop-color="#1f222e"/>
    </linearGradient>
  </defs>

  <rect width="800" height="600" fill="url(#officeWall)"/>
  
  <!-- Desk surface -->
  <polygon points="0,320 800,320 800,600 0,600" fill="url(#deskWood)"/>
  <line x1="0" y1="320" x2="800" y2="320" stroke="#00f0ff" stroke-width="2" opacity="0.4"/>

  <!-- Dual Monitors -->
  <rect x="140" y="100" width="260" height="170" rx="6" fill="#090b10" stroke="#334155" stroke-width="3"/>
  <rect x="155" y="115" width="230" height="140" fill="#0284c7" opacity="0.4"/>
  <rect x="255" y="270" width="30" height="55" fill="#334155"/>
  <rect x="230" y="320" width="80" height="12" rx="4" fill="#1e293b"/>

  <rect x="420" y="100" width="260" height="170" rx="6" fill="#090b10" stroke="#334155" stroke-width="3"/>
  <rect x="435" y="115" width="230" height="140" fill="#8b5cf6" opacity="0.3"/>
  <rect x="535" y="270" width="30" height="55" fill="#334155"/>
  <rect x="510" y="320" width="80" height="12" rx="4" fill="#1e293b"/>

  <!-- Keyboard and Mousepad (Crooked) -->
  <rect x="260" y="400" width="280" height="85" rx="6" fill="#0f172a" stroke="#475569" stroke-width="2" transform="rotate(-6 260 400)"/>
  <rect x="570" y="420" width="50" height="80" rx="20" fill="#1e293b" stroke="#475569" stroke-width="2" transform="rotate(15 570 420)"/>

  <!-- CLUTTER: 4 Coffee Mugs, Tangled Wires, Loose Papers -->
  <!-- Coffee Mug 1 -->
  <ellipse cx="120" cy="380" rx="22" ry="16" fill="#f87171" stroke="#dc2626" stroke-width="2"/>
  <!-- Coffee Mug 2 -->
  <ellipse cx="160" cy="420" rx="20" ry="15" fill="#38bdf8" stroke="#0284c7" stroke-width="2"/>
  <!-- Coffee Mug 3 -->
  <ellipse cx="680" cy="370" rx="22" ry="16" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>

  <!-- Tangled Wires -->
  <path d="M280,330 C200,370 240,450 180,480 S220,540 290,510" stroke="#00f0ff" stroke-width="3" fill="none" opacity="0.8"/>
  <path d="M540,330 C580,390 640,360 670,450" stroke="#f43f5e" stroke-width="3" fill="none" opacity="0.7"/>

  <!-- Sticky notes everywhere -->
  <rect x="360" y="250" width="35" height="35" fill="#fef08a" stroke="#ca8a04" stroke-width="1" transform="rotate(8 360 250)"/>
  <rect x="440" y="255" width="35" height="35" fill="#fbcfe8" stroke="#db2777" stroke-width="1" transform="rotate(-12 440 255)"/>
  <rect x="410" y="350" width="35" height="35" fill="#bbf7d0" stroke="#16a34a" stroke-width="1" transform="rotate(22 410 350)"/>

  <!-- Paper stack -->
  <polygon points="60,460 140,440 160,520 80,540" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1"/>
  <polygon points="70,450 150,430 170,510 90,530" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1"/>
</svg>
`;

const bathroomSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="bathWall" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#19222d"/>
      <stop offset="100%" stop-color="#101720"/>
    </linearGradient>
    <linearGradient id="mirrorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2d3d4f"/>
      <stop offset="100%" stop-color="#1a2735"/>
    </linearGradient>
  </defs>

  <rect width="800" height="600" fill="url(#bathWall)"/>
  
  <!-- Large Bathroom Mirror -->
  <rect x="180" y="40" width="440" height="260" rx="10" fill="url(#mirrorGrad)" stroke="#64748b" stroke-width="4"/>
  <line x1="220" y1="40" x2="300" y2="300" stroke="#ffffff" stroke-width="2" opacity="0.15"/>

  <!-- Vanity Countertop -->
  <polygon points="0,320 800,320 800,600 0,600" fill="#252f3d"/>
  <line x1="0" y1="320" x2="800" y2="320" stroke="#38bdf8" stroke-width="3" opacity="0.4"/>

  <!-- Sink & Tap -->
  <ellipse cx="400" cy="430" rx="140" ry="85" fill="#131a24" stroke="#475569" stroke-width="3"/>
  <circle cx="400" cy="450" r="14" fill="#0b0f14"/>
  <path d="M400,330 Q400,285 415,295" fill="none" stroke="#94a3b8" stroke-width="8" stroke-linecap="round"/>

  <!-- CLUTTER: Toiletries, half-used tubes, makeup brushes, towels -->
  <!-- Bottles on left -->
  <rect x="100" y="340" width="25" height="65" rx="4" fill="#f43f5e" stroke="#be123c" stroke-width="2"/>
  <rect x="135" y="325" width="30" height="80" rx="6" fill="#38bdf8" stroke="#0284c7" stroke-width="2"/>
  <rect x="175" y="360" width="20" height="45" rx="3" fill="#a855f7" stroke="#7e22ce" stroke-width="2"/>
  <rect x="80" y="390" width="50" height="20" rx="8" fill="#facc15" stroke="#ca8a04" stroke-width="1" transform="rotate(-20 80 390)"/>

  <!-- Clutter on right: Hair dryer, towel, jar -->
  <ellipse cx="660" cy="400" rx="35" ry="24" fill="#ec4899" stroke="#db2777" stroke-width="2"/>
  <path d="M570,390 C600,370 650,420 590,460" stroke="#64748b" stroke-width="6" fill="none"/>
  <!-- Crumpled hand towel -->
  <path d="M220,440 C210,410 270,390 290,430 C300,450 240,470 220,440 Z" fill="#67e8f9" opacity="0.8"/>
  <rect x="680" y="350" width="32" height="50" rx="4" fill="#34d399" stroke="#059669" stroke-width="2"/>
</svg>
`;

export const SAMPLE_ROOMS: SampleRoom[] = [
  {
    id: 'kitchen-clutter',
    title: 'Disaster Kitchen Counter',
    roomType: 'kitchen',
    description: 'Piled ceramic mugs, dirty plates near sink, cereal box, food wrappers.',
    thumbnailSvg: kitchenSvg,
    imageDataUri: svgToDataUri(kitchenSvg),
  },
  {
    id: 'bedroom-clothes',
    title: 'Bedroom Clothes Mountain',
    roomType: 'bedroom',
    description: 'Unmade bed, floordrobe chair explosion, shoes and socks scattered on floor.',
    thumbnailSvg: bedroomSvg,
    imageDataUri: svgToDataUri(bedroomSvg),
  },
  {
    id: 'tech-desk',
    title: 'WFH Cockpit Overload',
    roomType: 'desk',
    description: '4 coffee mugs, tangled cables, post-it notes, loose paperwork stack.',
    thumbnailSvg: deskSvg,
    imageDataUri: svgToDataUri(deskSvg),
  },
  {
    id: 'bathroom-vanity',
    title: 'Bathroom Vanity Gridlock',
    roomType: 'bathroom',
    description: 'Scattered toiletries, hair tools, open lotion tubes, crumpled towel.',
    thumbnailSvg: bathroomSvg,
    imageDataUri: svgToDataUri(bathroomSvg),
  },
];
