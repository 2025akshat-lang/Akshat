
function pvPlac(){const L=PV.L,S='stroke="var(--fg)" stroke-width="1" fill="#f1f8e9"',D=(x,y)=>`<circle cx="${x}" cy="${y}" r="2.4" fill="#7cb342" stroke="#33691e" stroke-width=".5"/>`;let s='';
  const G=[
   x=>`<ellipse cx="${x}" cy="28" rx="13" ry="20" ${S}/>`+[14,24,34,44].map(y=>D(x+9,y-8)).join(''),
   x=>`<circle cx="${x}" cy="28" r="20" ${S}/>`+[90,210,330].map(a=>`<line x1="${x}" y1="28" x2="${x+20*Math.cos(a*Math.PI/180)}" y2="${28-20*Math.sin(a*Math.PI/180)}" stroke="var(--fg)" stroke-width=".8"/>`+D(x+8*Math.cos((a+60)*Math.PI/180),28-8*Math.sin((a+60)*Math.PI/180))).join(''),
   x=>`<circle cx="${x}" cy="28" r="20" ${S}/>`+[30,150,270].map(a=>D(x+16*Math.cos(a*Math.PI/180),28-16*Math.sin(a*Math.PI/180))).join(''),
   x=>`<circle cx="${x}" cy="28" r="20" ${S}/><circle cx="${x}" cy="28" r="5" fill="#dcedc8" stroke="var(--fg)" stroke-width=".6"/>`+[0,90,180,270].map(a=>D(x+5*Math.cos(a*Math.PI/180),28-5*Math.sin(a*Math.PI/180))).join(''),
   x=>`<ellipse cx="${x}" cy="28" rx="13" ry="20" ${S}/>`+D(x,44)];
  const N=[['Marginal','सीमांत'],['Axile','स्तंभीय'],['Parietal','भित्तीय'],['Free central','मुक्त स्तंभीय'],['Basal','आधारी']];
  G.forEach((f,i)=>{const x=25+i*48;s+=f(x)+`<text x="${x}" y="58" font-size="6" text-anchor="middle" fill="var(--fg)">${L(N[i][0],N[i][1])}</text>`});return s}
PV.theory.add({id:'flower',i:'🌸',n:['Flower, fruit and seed','पुष्प, फल और बीज'],t:[
{id:'complete',n:['Complete or incomplete, bisexual or unisexual','पूर्ण/अपूर्ण, उभयलिंगी/एकलिंगी'],f:{
 d:['A complete flower has all four whorls: sepals, petals, stamens and carpels. An incomplete flower lacks one or more. A bisexual flower has both stamens and carpels; a unisexual flower has only one kind.','पूर्ण पुष्प में चारों चक्र होते हैं: बाह्यदल, दल, पुंकेसर और अंडप। अपूर्ण में एक या अधिक नहीं होते। उभयलिंगी पुष्प में पुंकेसर और अंडप दोनों होते हैं; एकलिंगी में केवल एक।'],
 e:['Mustard and hibiscus: complete and bisexual. Cucumber, papaya, maize: unisexual.','सरसों और गुड़हल: पूर्ण व उभयलिंगी। खीरा, पपीता, मक्का: एकलिंगी।'],
 c:['“Complete” is about the four whorls; “bisexual” is about the reproductive parts. A flower can be bisexual yet incomplete.','“पूर्ण” चारों चक्रों की बात है; “उभयलिंगी” जनन-अंगों की। पुष्प उभयलिंगी होकर भी अपूर्ण हो सकता है।']}},
{id:'symmetry',n:['Symmetry of flowers','पुष्प की सममिति'],f:{
 t:['Actinomorphic: can be cut into equal halves in many planes (mustard, datura, chilli). Zygomorphic: only one plane (pea, gulmohar, bean). Asymmetric: no plane (canna).','त्रिज्यासममित: कई तलों में बराबर भागों में बँटता है (सरसों, धतूरा, मिर्च)। एकव्याससममित: केवल एक तल में (मटर, गुलमोहर, सेम)। असममित: किसी तल में नहीं (कैना)।']}},
{id:'ovarypos',n:['Position of the ovary','अंडाशय की स्थिति'],f:{
 t:['Hypogynous: ovary superior, other parts below it (mustard, China rose, brinjal). Perigynous: ovary at the same level as the other parts on the rim (plum, rose, peach). Epigynous: ovary inferior, other parts above it (guava, cucumber, sunflower ray florets).','अधोजायांगी: अंडाशय ऊपर, अन्य भाग नीचे (सरसों, गुड़हल, बैंगन)। परिजायांगी: अंडाशय और अन्य भाग एक ही स्तर पर किनारे पर (आलूबुखारा, गुलाब, आड़ू)। उपरिजायांगी: अंडाशय नीचे, अन्य भाग ऊपर (अमरूद, खीरा, सूरजमुखी के रे-पुष्प)।'],
 c:['Superior ovary goes with hypogynous flowers; inferior ovary goes with epigynous flowers.','ऊर्ध्वस्थ अंडाशय अधोजायांगी पुष्प में और अधःस्थ अंडाशय उपरिजायांगी पुष्प में होता है।']}},
{id:'aestiv',n:['Aestivation','पुष्पदल विन्यास'],f:{
 d:['The arrangement of sepals or petals in the bud.','कली में बाह्यदलों या दलों के लगने का क्रम।'],
 t:['Valvate: edges touch without overlap (Calotropis). Twisted: each overlaps the next (China rose, cotton). Imbricate: irregular overlap (Cassia, gulmohar). Vexillary: large standard petal over two wings, which cover the keel (pea).','कोरस्पर्शी: किनारे छूते हैं, ढकते नहीं (आक)। व्यावर्तित: प्रत्येक अगले को ढकता है (गुड़हल, कपास)। अधिच्छादी: अनियमित ढकाव (कैसिया, गुलमोहर)। ध्वजाकार: बड़ी ध्वज पंखुड़ी दो पक्षों को ढकती है, जो नौतल को ढकते हैं (मटर)।']}},
{id:'placent',n:['Placentation','बीजांडन्यास'],vb:'0 0 245 64',v:pvPlac,sc:['flower-ovary'],f:{
 d:['The arrangement of ovules inside the ovary.','अंडाशय के भीतर बीजांडों के लगने का क्रम।'],
 t:['Marginal (pea), axile (China rose, tomato, lemon), parietal (mustard, Argemone), free central (Dianthus, primrose) and basal (sunflower, marigold).','सीमांत (मटर), स्तंभीय (गुड़हल, टमाटर, नींबू), भित्तीय (सरसों, सत्यानाशी), मुक्त स्तंभीय (डायएन्थस, प्रिमरोज़) और आधारी (सूरजमुखी, गेंदा)।'],
 c:['Marginal needs a single carpel; axile has several chambers (locules) with ovules on a central axis.','सीमांत में एक अंडप होता है; स्तंभीय में कई कक्ष होते हैं और बीजांड केंद्रीय अक्ष पर लगते हैं।']}},
{id:'inflo',n:['Inflorescence','पुष्पक्रम'],f:{
 d:['The arrangement of flowers on the floral axis.','पुष्प-अक्ष पर फूलों के लगने का क्रम।'],
 t:['Racemose: the main axis keeps growing and the youngest flowers are near the tip (mustard, radish). Cymose: the main axis ends in a flower and the youngest flowers are near the base (jasmine, Calotropis, Bougainvillea). Special types: cyathium (Euphorbia), verticillaster (tulsi), hypanthodium (fig).','असीमाक्षी: मुख्य अक्ष बढ़ता रहता है और सबसे नए फूल सिरे के पास होते हैं (सरसों, मूली)। ससीमाक्षी: मुख्य अक्ष फूल में समाप्त होता है और सबसे नए फूल आधार के पास होते हैं (चमेली, आक, बोगनविलिया)। विशेष: साइएथियम (यूफॉर्बिया), कूटचक्रक (तुलसी), हाइपेन्थोडियम (अंजीर)।']}},
{id:'floralformula',n:['Floral formula','पुष्प सूत्र'],f:{
 d:['A short code that shows the parts and symmetry of a flower.','फूल के भागों और सममिति को दिखाने वाला संक्षिप्त संकेत।'],
 s:['⊕ actinomorphic, % zygomorphic, ⚥ bisexual. K calyx, C corolla, A androecium, G gynoecium. A number gives how many; brackets mean fused parts; “+” separates whorls. G with a line below means superior ovary, a line above means inferior.','⊕ त्रिज्यासममित, % एकव्याससममित, ⚥ उभयलिंगी। K बाह्यदलपुंज, C दलपुंज, A पुमंग, G जायांग। संख्या कितने भाग बताती है; कोष्ठक = जुड़े भाग; “+” चक्रों को अलग करता है। G के नीचे रेखा = ऊर्ध्वस्थ अंडाशय, ऊपर रेखा = अधःस्थ।'],
 e:['Mustard: ⊕ ⚥ K2+2 C4 A2+4 G(2). Pea: % ⚥ K(5) C1+2+(2) A(9)+1 G1.','सरसों: ⊕ ⚥ K2+2 C4 A2+4 G(2)। मटर: % ⚥ K(5) C1+2+(2) A(9)+1 G1।'],
 c:['The formula describes one typical flower of the species; individual flowers can vary.','सूत्र प्रजाति के एक सामान्य फूल का वर्णन है; अलग-अलग फूल थोड़े भिन्न हो सकते हैं।']}},
{id:'truefalse',n:['True and false fruits','सत्य और असत्य फल'],sc:['fruit-cross'],f:{
 d:['A true fruit develops only from the ovary. A false fruit also includes other parts of the flower.','सत्य फल केवल अंडाशय से बनता है। असत्य फल में फूल के अन्य भाग भी जुड़ जाते हैं।'],
 e:['True: mango, tomato, pea pod. False: apple and pear (thalamus), strawberry (thalamus).','सत्य: आम, टमाटर, मटर की फली। असत्य: सेब और नाशपाती (पुष्पासन), स्ट्रॉबेरी (पुष्पासन)।']}},
{id:'fruittypes',n:['Simple, aggregate and multiple fruits','सरल, पुंजित और संग्रथित फल'],f:{
 t:['Simple: from one ovary (mango, pea pod). Aggregate: from many free carpels of one flower (strawberry, custard apple). Multiple: from the whole inflorescence (pineapple, jackfruit, mulberry).','सरल: एक अंडाशय से (आम, मटर की फली)। पुंजित: एक फूल के कई मुक्त अंडपों से (स्ट्रॉबेरी, शरीफ़ा)। संग्रथित: पूरे पुष्पक्रम से (अनानास, कटहल, शहतूत)।'],
 c:['Count flowers and carpels: one flower with many carpels gives aggregate; many flowers give multiple.','फूलों और अंडपों को गिनें: एक फूल के कई अंडप = पुंजित; कई फूल = संग्रथित।']}},
{id:'partheno',n:['Parthenocarpy','अनिषेकफलन'],f:{
 d:['Fruit forms without fertilisation, so it is usually seedless.','निषेचन के बिना फल बनता है, इसलिए प्रायः बीज-रहित होता है।'],
 e:['Banana, seedless grapes.','केला, बीज-रहित अंगूर।'],
 x:['It can be induced by spraying auxins or gibberellins on flowers.','फूलों पर ऑक्सिन या जिबरेलिन छिड़ककर इसे प्रेरित किया जा सकता है।'],
 c:['Parthenocarpy gives a fruit without seeds; apomixis gives seeds without fertilisation.','अनिषेकफलन में बिना बीज का फल बनता है; अनिषेकबीजता (एपोमिक्सिस) में बिना निषेचन बीज बनते हैं।']}},
{id:'albumin',n:['Albuminous and exalbuminous seeds','भ्रूणपोषी और अभ्रूणपोषी बीज'],sc:['seed','seed-mono'],f:{
 d:['Albuminous seeds keep endosperm at maturity. In exalbuminous seeds the endosperm is used up and food is stored in the cotyledons.','भ्रूणपोषी बीजों में परिपक्व होने पर भ्रूणपोष बना रहता है। अभ्रूणपोषी बीजों में भ्रूणपोष खप जाता है और भोजन बीजपत्रों में जमा होता है।'],
 e:['Albuminous: wheat, maize, castor, coconut. Exalbuminous: pea, bean, groundnut.','भ्रूणपोषी: गेहूँ, मक्का, अरंडी, नारियल। अभ्रूणपोषी: मटर, सेम, मूँगफली।']}},
{id:'apomixis',n:['Apomixis and polyembryony','एपोमिक्सिस और बहुभ्रूणता'],f:{
 d:['Apomixis: seeds form without fertilisation (and often without meiosis), so seedlings are clones of the mother. Polyembryony: more than one embryo in a seed.','एपोमिक्सिस: बिना निषेचन (और प्रायः बिना अर्धसूत्रण) बीज बनते हैं, इसलिए पौध माँ के क्लोन होते हैं। बहुभ्रूणता: एक बीज में एक से अधिक भ्रूण।'],
 e:['Polyembryony: citrus, mango. Apomixis: some grasses and Asteraceae.','बहुभ्रूणता: नींबू-वर्ग, आम। एपोमिक्सिस: कुछ घासें और एस्टरेसी।'],
 x:['Apomictic hybrid seeds could keep hybrid vigour year after year, so farmers need not buy new seed.','एपोमिक्टिक संकर बीज हर साल संकर ओज बनाए रख सकते हैं, इसलिए किसानों को नया बीज नहीं खरीदना पड़ेगा।']}},
{id:'dormancy',n:['Seed dormancy','बीज की सुषुप्तावस्था'],f:{
 d:['A resting state in which a living seed does not germinate even when water, warmth and air are available.','वह विश्राम-अवस्था जिसमें जीवित बीज पानी, गर्मी और हवा मिलने पर भी अंकुरित नहीं होता।'],
 s:['Causes: hard seed coat, immature embryo, or germination inhibitors such as abscisic acid.','कारण: कठोर बीजचोल, अपरिपक्व भ्रूण, या अवरोधक जैसे एब्सिसिक अम्ल।'],
 x:['Broken by scratching the coat, soaking, cold treatment or washing out inhibitors.','बीजचोल खुरचने, भिगोने, ठंड के उपचार या अवरोधक धोने से टूटती है।'],
 c:['Dormancy helps seeds wait for a good season and spread germination over time. A dormant seed is alive, not dead.','सुषुप्तावस्था से बीज अच्छे मौसम की प्रतीक्षा करते हैं और अंकुरण समय में बिखर जाता है। सुषुप्त बीज जीवित है, मृत नहीं।']}}
]});
