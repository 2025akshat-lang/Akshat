
function pvCycle(nodes,edges){
  const L=PV.L,k=nodes.length,W=64,Hh=17,P=nodes.map((n,i)=>{const a=-Math.PI/2+i*2*Math.PI/k;return[120+80*Math.cos(a),55+36*Math.sin(a)]});
  let s='<defs><marker id="pvah" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6z" fill="var(--fg)"/></marker></defs>';
  edges.forEach((e,i)=>{const a=P[i],b=P[(i+1)%k],dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy),ux=dx/d,uy=dy/d,t=Math.min(ux?W/2/Math.abs(ux):1e9,uy?Hh/2/Math.abs(uy):1e9)+2,mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;
    s+=`<line x1="${a[0]+ux*t}" y1="${a[1]+uy*t}" x2="${b[0]-ux*t}" y2="${b[1]-uy*t}" stroke="var(--fg)" stroke-width="1" marker-end="url(#pvah)"/><text x="${mx-uy*9}" y="${my+ux*9+2}" font-size="5.5" text-anchor="middle" fill="var(--muted)" font-style="italic">${L(e[0],e[1])}</text>`});
  nodes.forEach((n,i)=>{s+=`<rect x="${P[i][0]-W/2}" y="${P[i][1]-Hh/2}" width="${W}" height="${Hh}" rx="5" fill="${n[2]==='n'?'#aed581':n[2]==='2n'?'#ce93d8':'#90caf9'}" stroke="var(--fg)" stroke-width=".6"/><text x="${P[i][0]}" y="${P[i][1]+2.2}" font-size="6.3" text-anchor="middle" fill="#1b1b1b">${L(n[0],n[1])}</text>`});
  return s+(nodes.some(n=>n[2]==='n'||n[2]==='2n')?`<text x="6" y="106" font-size="5.5" fill="var(--muted)">${L('green = haploid (n), purple = diploid (2n)','हरा = अगुणित (n), बैंगनी = द्विगुणित (2n)')}</text>`:'')}
PV.theory.add({id:'lifecycle',i:'♻️',n:['Life cycles','जीवन-चक्र'],t:[
{id:'altgen',n:['Alternation of generations','पीढ़ी-एकांतरण'],v:()=>pvCycle([['Sporophyte (2n)','बीजाणुउद्भिद (2n)','2n'],['Spores (n)','बीजाणु (n)','n'],['Gametophyte (n)','युग्मकोद्भिद (n)','n'],['Gametes (n)','युग्मक (n)','n'],['Zygote (2n)','युग्मनज (2n)','2n']],[['meiosis','अर्धसूत्रण'],['germination','अंकुरण'],['mitosis','समसूत्रण'],['fusion','संलयन'],['mitosis, growth','समसूत्रण, वृद्धि']]),f:{
 d:['Many plants have two multicellular phases: a haploid (n) gametophyte that makes gametes, and a diploid (2n) sporophyte that makes spores.','कई पौधों में दो बहुकोशिकीय अवस्थाएँ होती हैं: अगुणित (n) युग्मकोद्भिद जो युग्मक बनाता है और द्विगुणित (2n) बीजाणुउद्भिद जो बीजाणु बनाता है।'],
 m:['Gametes fuse to form a zygote (2n) that grows into the sporophyte. Meiosis in the sporangia gives spores (n) that grow into the gametophyte.','युग्मक मिलकर युग्मनज (2n) बनाते हैं जो बीजाणुउद्भिद में बढ़ता है। बीजाणुधानियों में अर्धसूत्रण से बीजाणु (n) बनते हैं जो युग्मकोद्भिद में बढ़ते हैं।'],
 c:['In plants meiosis makes spores, not gametes (unlike animals). Gametes come from mitosis of a cell that is already haploid.','पौधों में अर्धसूत्रण से बीजाणु बनते हैं, युग्मक नहीं (जंतुओं से अलग)। युग्मक पहले से अगुणित कोशिका के समसूत्रण से बनते हैं।']}},
{id:'haplontic',n:['Haplontic pattern','अगुणितक (हैप्लोन्टिक) चक्र'],v:()=>pvCycle([['Adult body (n)','वयस्क शरीर (n)','n'],['Gametes (n)','युग्मक (n)','n'],['Zygote (2n)','युग्मनज (2n)','2n'],['Spores (n)','बीजाणु (n)','n']],[['mitosis','समसूत्रण'],['fusion','संलयन'],['meiosis','अर्धसूत्रण'],['germination','अंकुरण']]),f:{
 d:['The main body is haploid. Only the zygote is diploid, and it undergoes meiosis at once (zygotic meiosis).','मुख्य शरीर अगुणित होता है। केवल युग्मनज द्विगुणित है और वह तुरंत अर्धसूत्रण करता है (युग्मनज अर्धसूत्रण)।'],
 e:['Volvox, Spirogyra, Chlamydomonas.','वॉल्वॉक्स, स्पाइरोगायरा, क्लैमाइडोमोनास।']}},
{id:'diplontic',n:['Diplontic pattern','द्विगुणितक (डिप्लोन्टिक) चक्र'],v:()=>pvCycle([['Adult body (2n)','वयस्क शरीर (2n)','2n'],['Gametes (n)','युग्मक (n)','n'],['Zygote (2n)','युग्मनज (2n)','2n']],[['meiosis','अर्धसूत्रण'],['fusion','संलयन'],['mitosis, growth','समसूत्रण, वृद्धि']]),f:{
 d:['The main body is diploid. Only the gametes are haploid, made by meiosis (gametic meiosis).','मुख्य शरीर द्विगुणित होता है। केवल युग्मक अगुणित हैं, जो अर्धसूत्रण से बनते हैं (युग्मक अर्धसूत्रण)।'],
 e:['The brown alga Fucus; in NCERT’s scheme, gymnosperms and angiosperms.','भूरी शैवाल फ्यूकस; NCERT की योजना में अनावृतबीजी और आवृतबीजी।'],
 c:['Seed plants still alternate generations, but the gametophyte is microscopic and lives inside the sporophyte, so they are treated as diplontic.','बीजधारी पौधों में भी पीढ़ी-एकांतरण होता है, पर युग्मकोद्भिद सूक्ष्म होकर बीजाणुउद्भिद के भीतर रहता है, इसलिए उन्हें द्विगुणितक माना जाता है।']}},
{id:'haplodiplontic',n:['Haplodiplontic pattern','अगुणित-द्विगुणितक चक्र'],v:()=>pvCycle([['Sporophyte (2n)','बीजाणुउद्भिद (2n)','2n'],['Spores (n)','बीजाणु (n)','n'],['Gametophyte (n)','युग्मकोद्भिद (n)','n'],['Gametes (n)','युग्मक (n)','n'],['Zygote (2n)','युग्मनज (2n)','2n']],[['meiosis','अर्धसूत्रण'],['germination','अंकुरण'],['mitosis','समसूत्रण'],['fusion','संलयन'],['mitosis, growth','समसूत्रण, वृद्धि']]),f:{
 d:['Both the haploid and the diploid phase are multicellular (sporic meiosis).','अगुणित और द्विगुणित दोनों अवस्थाएँ बहुकोशिकीय होती हैं (बीजाणु अर्धसूत्रण)।'],
 t:['Bryophytes: gametophyte dominant. Pteridophytes: sporophyte dominant.','ब्रायोफाइट: युग्मकोद्भिद प्रमुख। टेरिडोफाइट: बीजाणुउद्भिद प्रमुख।'],
 e:['Funaria (moss), ferns, and the kelp Laminaria.','फ्यूनेरिया (मॉस), फर्न और केल्प लैमिनेरिया।']}},
{id:'grp',n:['Gametophyte and sporophyte by group','समूह-वार युग्मकोद्भिद व बीजाणुउद्भिद'],
 tb:{h:[['Group','समूह'],['Gametophyte','युग्मकोद्भिद'],['Sporophyte','बीजाणुउद्भिद']],r:[
  [['Bryophytes','ब्रायोफाइट'],['Main, free-living, green','मुख्य, स्वतंत्र, हरा'],['Small, attached to gametophyte','छोटा, युग्मकोद्भिद से जुड़ा']],
  [['Pteridophytes','टेरिडोफाइट'],['Small, free-living prothallus','छोटा, स्वतंत्र प्रोथैलस'],['Main, independent','मुख्य, स्वतंत्र']],
  [['Gymnosperms','जिम्नोस्पर्म'],['Microscopic, inside cone and ovule','सूक्ष्म, शंकु व बीजांड के भीतर'],['Main, independent','मुख्य, स्वतंत्र']],
  [['Angiosperms','एंजियोस्पर्म'],['Pollen grain and embryo sac','परागकण व भ्रूणकोष'],['Main, independent','मुख्य, स्वतंत्र']]]}}
]});
