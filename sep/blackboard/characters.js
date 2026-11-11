/* Base characters. Naya character: registerCharacter({id,name,svg,sx,sy,arm,hand})
   svg = andar ka SVG (viewBox 0 0 120 280), sx/sy = kandhe ki jagah us viewBox mein, arm = haath ka rang, hand = hatheli ka rang.
   Lesson ya manifest mein  char:'owl'  likhoge to wahi character aayega. */
window.CHARS={};
window.registerCharacter=c=>{if(c&&c.id&&c.svg)CHARS[c.id]=c};
(()=>{const s=document.createElement('style');s.textContent='.blip{animation:blp 1s steps(2) infinite}@keyframes blp{50%{opacity:.2}}';document.head.appendChild(s)})();

registerCharacter({id:'robo',name:'Robo Bhaiya',sx:100,sy:148,arm:'#fb8500',hand:'#ffd166',svg:`
<rect x="36" y="222" width="16" height="48" fill="#6b7280"/><rect x="68" y="222" width="16" height="48" fill="#6b7280"/>
<ellipse cx="42" cy="272" rx="16" ry="7" fill="#374151"/><ellipse cx="76" cy="272" rx="16" ry="7" fill="#374151"/>
<rect x="20" y="128" width="84" height="100" rx="16" fill="#ffb703" stroke="#8a5a00" stroke-width="3"/>
<rect x="34" y="146" width="56" height="36" rx="6" fill="#1d3557"/>
<circle cx="48" cy="164" r="6" fill="#7dffa8"/><rect x="62" y="158" width="20" height="4" fill="#7fe3ff"/><rect x="62" y="166" width="14" height="4" fill="#7fe3ff"/>
<circle cx="42" cy="205" r="6" fill="#e63946"/><circle cx="62" cy="205" r="6" fill="#4cc9f0"/><circle cx="82" cy="205" r="6" fill="#ffd60a"/>
<rect x="52" y="110" width="16" height="20" fill="#9ca3af"/>
<line x1="60" y1="46" x2="60" y2="24" stroke="#374151" stroke-width="4"/><circle class="blip" cx="60" cy="18" r="8" fill="#e63946"/>
<rect x="6" y="66" width="12" height="22" rx="4" fill="#fb8500"/><rect x="102" y="66" width="12" height="22" rx="4" fill="#fb8500"/>
<rect x="18" y="44" width="84" height="68" rx="18" fill="#8ecae6" stroke="#023047" stroke-width="3"/>
<g class="eye"><circle cx="42" cy="72" r="14" fill="#fff" stroke="#023047" stroke-width="2"/><circle cx="45" cy="74" r="6" fill="#023047"/></g>
<g class="eye"><circle cx="80" cy="72" r="14" fill="#fff" stroke="#023047" stroke-width="2"/><circle cx="83" cy="74" r="6" fill="#023047"/></g>
<path d="M40 98L48 91L56 98L64 91L72 98L80 91" stroke="#023047" stroke-width="3" fill="none" stroke-linejoin="round"/>`});

registerCharacter({id:'owl',name:'Professor Ullu',sx:102,sy:150,arm:'#6d4c41',hand:'#ffcc80',svg:`
<ellipse cx="42" cy="272" rx="14" ry="7" fill="#ff9800"/><ellipse cx="78" cy="272" rx="14" ry="7" fill="#ff9800"/>
<ellipse cx="60" cy="170" rx="50" ry="92" fill="#8d6e63" stroke="#4e342e" stroke-width="3"/>
<ellipse cx="60" cy="208" rx="32" ry="50" fill="#ffe0b2"/>
<path d="M44 192q8 8 16 0M60 192q8 8 16 0M44 216q8 8 16 0M60 216q8 8 16 0" stroke="#c49a6c" stroke-width="3" fill="none"/>
<ellipse cx="12" cy="196" rx="12" ry="40" fill="#6d4c41"/>
<polygon points="24,100 18,72 48,92" fill="#6d4c41"/><polygon points="96,100 102,72 72,92" fill="#6d4c41"/>
<g class="eye"><circle cx="38" cy="120" r="23" fill="#fff" stroke="#3e2723" stroke-width="4"/><circle cx="40" cy="122" r="9" fill="#111"/></g>
<g class="eye"><circle cx="82" cy="120" r="23" fill="#fff" stroke="#3e2723" stroke-width="4"/><circle cx="80" cy="122" r="9" fill="#111"/></g>
<polygon points="50,138 70,138 60,158" fill="#ff9800" stroke="#e65100" stroke-width="2"/>
<polygon points="22,84 60,62 98,84 60,100" fill="#263238"/><rect x="46" y="94" width="28" height="8" fill="#37474f"/>
<line x1="98" y1="84" x2="106" y2="108" stroke="#ffd60a" stroke-width="3"/><circle cx="106" cy="110" r="4" fill="#ffd60a"/>`});

registerCharacter({id:'alien',name:'Zippy Alien',sx:86,sy:152,arm:'#9b5de5',hand:'#7bd88f',svg:`
<rect x="38" y="205" width="12" height="65" rx="6" fill="#6a4c93"/><rect x="70" y="205" width="12" height="65" rx="6" fill="#6a4c93"/>
<ellipse cx="44" cy="272" rx="14" ry="6" fill="#3a2a5a"/><ellipse cx="76" cy="272" rx="14" ry="6" fill="#3a2a5a"/>
<rect x="30" y="132" width="60" height="80" rx="24" fill="#9b5de5" stroke="#5a2ea6" stroke-width="3"/>
<polygon points="60,150 64,162 77,162 67,170 71,183 60,175 49,183 53,170 43,162 56,162" fill="#ffd60a"/>
<rect x="53" y="112" width="14" height="24" fill="#6ee7a0"/>
<line x1="38" y1="38" x2="28" y2="12" stroke="#2d6a4f" stroke-width="4"/><circle cx="26" cy="9" r="7" fill="#ff5d8f"/>
<line x1="82" y1="38" x2="92" y2="12" stroke="#2d6a4f" stroke-width="4"/><circle cx="94" cy="9" r="7" fill="#ffd60a"/>
<ellipse cx="60" cy="80" rx="52" ry="48" fill="#7bd88f" stroke="#2d6a4f" stroke-width="3"/>
<g class="eye"><circle cx="36" cy="72" r="13" fill="#fff" stroke="#2d6a4f" stroke-width="2"/><circle cx="38" cy="74" r="6" fill="#111"/></g>
<g class="eye"><circle cx="84" cy="72" r="13" fill="#fff" stroke="#2d6a4f" stroke-width="2"/><circle cx="82" cy="74" r="6" fill="#111"/></g>
<g class="eye"><circle cx="60" cy="54" r="10" fill="#fff" stroke="#2d6a4f" stroke-width="2"/><circle cx="60" cy="56" r="4.5" fill="#111"/></g>
<path d="M34 96Q60 122 86 96Z" fill="#7a1f3d" stroke="#2d6a4f" stroke-width="2"/><rect x="46" y="97" width="8" height="9" fill="#fff"/><rect x="66" y="97" width="8" height="9" fill="#fff"/>`});
