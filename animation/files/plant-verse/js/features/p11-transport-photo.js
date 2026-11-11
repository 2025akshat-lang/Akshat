
function pvSpec(){const L=PV.L,g=(x,m,s)=>Math.exp(-Math.pow((x-m)/s,2)),X=n=>20+(n-400)*.7,Y=v=>88-v*70,
  A=n=>.95*g(n,430,18)+.8*g(n,662,14)+.05,B=n=>.85*g(n,453,18)+.5*g(n,642,14)+.05,C=n=>.6*g(n,480,22)+.05,AC=n=>Math.min(1,.55*A(n)+.3*B(n)+.3*C(n)),
  pl=(f,col,dash)=>`<polyline fill="none" stroke="${col}" stroke-width="1.4"${dash?' stroke-dasharray="3 2"':''} points="${Array.from({length:31},(_,i)=>{const n=400+i*10;return X(n).toFixed(1)+','+Y(f(n)).toFixed(1)}).join(' ')}"/>`;
  return `<defs><linearGradient id="pvsp"><stop offset="0" stop-color="#7e57c2"/><stop offset=".25" stop-color="#1e88e5"/><stop offset=".45" stop-color="#43a047"/><stop offset=".65" stop-color="#fdd835"/><stop offset=".8" stop-color="#fb8c00"/><stop offset="1" stop-color="#e53935"/></linearGradient></defs>`
   +`<rect x="20" y="92" width="210" height="5" fill="url(#pvsp)"/><line x1="20" y1="88" x2="230" y2="88" stroke="var(--fg)" stroke-width=".6"/>`
   +[400,500,600,700].map(n=>`<text x="${X(n)}" y="106" font-size="6" text-anchor="middle" fill="var(--fg)">${n}</text>`).join('')
   +pl(A,'#2e7d32')+pl(B,'#1565c0')+pl(AC,'#e65100',1)
   +`<text x="128" y="14" font-size="5.8" fill="#2e7d32">${L('chlorophyll a','क्लोरोफिल a')}</text><text x="128" y="22" font-size="5.8" fill="#1565c0">${L('chlorophyll b','क्लोरोफिल b')}</text><text x="128" y="30" font-size="5.8" fill="#e65100">${L('action spectrum (dashed)','क्रिया स्पेक्ट्रम (बिंदीदार)')}</text><text x="230" y="106" font-size="5.5" text-anchor="end" fill="var(--muted)">nm</text>`}
function pvZ(){const L=PV.L;
  return `<polyline fill="none" stroke="#fbc02d" stroke-width="2.2" points="30,86 50,20"/><polyline fill="none" stroke="#fbc02d" stroke-width="2.2" points="105,64 125,10"/>`
   +`<polyline fill="none" stroke="var(--fg)" stroke-width="1" stroke-dasharray="3 2" points="50,20 78,36 105,64"/><polyline fill="none" stroke="var(--fg)" stroke-width="1" stroke-dasharray="3 2" points="125,10 160,22 195,38"/>`
   +[[30,86,'P680','',-4,10],[50,20,'P680*','',-2,-4],[105,64,'P700','',4,11],[125,10,'P700*','',4,-2],[195,38,'NADPH','',-2,-5]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="2.4" fill="#2e7d32"/><text x="${p[0]+p[4]}" y="${p[1]+p[5]}" font-size="6" fill="var(--fg)">${p[2]}</text>`).join('')
   +`<text x="66" y="22" font-size="5.5" fill="var(--muted)">${L('electron transport chain: ATP','इलेक्ट्रॉन परिवहन शृंखला: ATP')}</text><text x="4" y="102" font-size="5.8" fill="var(--fg)">${L('H₂O → O₂ + H⁺ + e⁻ (photolysis)','H₂O → O₂ + H⁺ + e⁻ (प्रकाश-अपघटन)')}</text><text x="100" y="86" font-size="5.5" fill="#f9a825">${L('light','प्रकाश')}</text><text x="226" y="6" font-size="5.5" text-anchor="end" fill="var(--muted)">${L('energy ↑','ऊर्जा ↑')}</text>`}
PV.theory.add({id:'transp',i:'💧',n:['Transport in plants','पादपों में परिवहन'],t:[
{id:'pathways',n:['Three water pathways','जल के तीन मार्ग'],sc:['root-cross'],f:{
 d:['Apoplast: through cell walls and spaces (fast, non-living path). Symplast: through cytoplasm linked by plasmodesmata. Transmembrane: crossing membranes cell to cell, using aquaporins.','एपोप्लास्ट: भित्तियों और अंतराकोशिकी स्थानों से (तेज़, निर्जीव मार्ग)। सिम्प्लास्ट: प्लाज़्मोडेस्माटा से जुड़े कोशिकाद्रव्य से। अंतःझिल्ली: एक्वापोरिन से होकर कोशिका-दर-कोशिका झिल्ली पार करना।'],
 m:['At the endodermis the waxy Casparian strip blocks the apoplast, so water must enter cells. This lets the root filter ions before they reach the xylem.','अंतःत्वचा में मोमी कैस्पेरियन पट्टी एपोप्लास्ट को रोक देती है, इसलिए पानी को कोशिकाओं में जाना पड़ता है। इससे जड़ जाइलम तक पहुँचने से पहले आयनों को छान लेती है।']}},
{id:'ascent',n:['Ascent of sap (cohesion–tension)','रसारोहण (संसंजन-तनाव)'],f:{
 d:['Transpiration at the leaf lowers pressure in the xylem, creating tension that pulls water up.','पत्ती में वाष्पोत्सर्जन से जाइलम में दाब घटता है, जिससे तनाव बनता है जो पानी को ऊपर खींचता है।'],
 m:['Water molecules stick to each other (cohesion) and to xylem walls (adhesion), so a continuous column rises without breaking.','जल-अणु आपस में (संसंजन) और जाइलम की दीवारों से (आसंजन) चिपकते हैं, इसलिए पानी का सतत स्तंभ टूटे बिना ऊपर चढ़ता है।'],
 c:['Living cells do not pump the sap up. The xylem tubes are dead and the pull comes from evaporation.','जीवित कोशिकाएँ रस को ऊपर पंप नहीं करतीं। जाइलम नलिकाएँ मृत हैं और खिंचाव वाष्पन से आता है।']}},
{id:'rootpress',n:['Root pressure and guttation','मूल दाब और बिंदुस्राव'],f:{
 d:['Root pressure is a positive pressure in the xylem built when roots actively take in ions and water follows by osmosis.','मूल दाब जाइलम में बना धनात्मक दाब है, जो तब बनता है जब जड़ें आयन सक्रिय रूप से लेती हैं और पानी परासरण से पीछे आता है।'],
 m:['At night or in humid air it pushes liquid water out through hydathodes at leaf edges (guttation).','रात में या नम हवा में यह तरल पानी को पत्ती के किनारों के जलरंध्रों (हाइडैथोड) से बाहर धकेलता है (बिंदुस्राव)।'],
 c:['Guttation is liquid water; transpiration is water vapour. Root pressure alone cannot lift water in tall trees.','बिंदुस्राव तरल पानी है; वाष्पोत्सर्जन जलवाष्प। केवल मूल दाब ऊँचे पेड़ों में पानी नहीं चढ़ा सकता।']}},
{id:'transp',n:['Transpiration and its factors','वाष्पोत्सर्जन और उसके कारक'],f:{
 d:['Loss of water vapour from aerial parts, mainly through stomata.','वायवीय भागों से, मुख्यतः रंध्रों से, जलवाष्प की हानि।'],
 t:['Faster with more light (stomata open), higher temperature, lower humidity, wind, more soil water, bigger leaf area and wider stomatal opening.','अधिक प्रकाश (रंध्र खुलते हैं), अधिक तापमान, कम आर्द्रता, हवा, अधिक मृदा-जल, बड़े पत्ती-क्षेत्र और चौड़े रंध्र-छिद्र से तेज़ होता है।'],
 x:['It pulls water and minerals up and cools the leaf. A potometer measures water uptake.','यह पानी और खनिज ऊपर खींचता है और पत्ती को ठंडा करता है। पोटोमीटर से जल-अवशोषण मापा जाता है।']}},
{id:'stomata',n:['How stomata open and close','रंध्र कैसे खुलते-बंद होते हैं'],sc:['leaf-stomata'],f:{
 m:['In light, guard cells take up K⁺ (and make malate), so water enters and they become turgid. Their thick inner walls make them bend apart and the pore opens. ABA in water stress makes K⁺ leave and the pore closes.','प्रकाश में रक्षक कोशिकाएँ K⁺ लेती हैं (और मैलेट बनाती हैं), इसलिए पानी भीतर आता है और वे स्फीत होती हैं। मोटी भीतरी दीवार के कारण वे मुड़कर अलग होती हैं और छिद्र खुलता है। जल-तनाव में ABA से K⁺ बाहर जाता है और छिद्र बंद होता है।'],
 c:['Guard cells are the only epidermal cells with chloroplasts in many plants, but the opening is driven by ion movement, not by sugar alone.','कई पौधों में अधिचर्म की केवल रक्षक कोशिकाओं में हरितलवक होते हैं, पर खुलना आयनों की गति से होता है, केवल शर्करा से नहीं।']}},
{id:'phloem',n:['Phloem transport (pressure flow)','फ्लोएम परिवहन (दाब-प्रवाह)'],f:{
 d:['Sugars move from a source (such as a leaf) to a sink (root, fruit, growing tip or storage organ).','शर्करा स्रोत (जैसे पत्ती) से उपयोग-स्थल (जड़, फल, वर्धी सिरा या भंडार अंग) की ओर जाती है।'],
 m:['At the source, sucrose is actively loaded into sieve tubes, water enters by osmosis and pressure rises. At the sink, sugar is unloaded, water leaves and pressure falls, so sap flows along the pressure gradient.','स्रोत पर सुक्रोज़ सक्रिय रूप से छलनी नलिकाओं में भरी जाती है, पानी परासरण से आता है और दाब बढ़ता है। उपयोग-स्थल पर शर्करा उतरती है, पानी निकलता है और दाब घटता है, इसलिए रस दाब-ढाल के अनुसार बहता है।'],
 x:['Girdling (ringing) a stem makes sugar pile up above the cut. Aphid stylets sample phloem sap.','तने पर छल्ला काटने से कट के ऊपर शर्करा जमा होती है। एफ़िड की सूँड़ फ्लोएम रस चूसती है।'],
 c:['A source can become a sink: a storage root is a sink in summer and a source in spring. Each sieve tube flows one way at a time.','स्रोत उपयोग-स्थल बन सकता है: भंडारण जड़ गर्मी में उपयोग-स्थल और वसंत में स्रोत होती है। हर छलनी नलिका एक समय में एक ही दिशा में बहती है।']}}
]});
PV.theory.add({id:'photo',i:'☀️',n:['Photosynthesis','प्रकाश-संश्लेषण'],t:[
{id:'pigments',n:['Pigments and spectra','वर्णक और स्पेक्ट्रम'],v:pvSpec,vb:'0 0 240 110',f:{
 d:['Chlorophyll a is the main pigment. Chlorophyll b, xanthophylls and carotenoids are accessory pigments that widen the light absorbed and protect against damage.','क्लोरोफिल a मुख्य वर्णक है। क्लोरोफिल b, ज़ैन्थोफिल और कैरोटीनॉइड सहायक वर्णक हैं जो अवशोषित प्रकाश बढ़ाते हैं और क्षति से बचाते हैं।'],
 m:['Absorption spectrum: light each pigment absorbs (peaks in blue and red). Action spectrum: photosynthesis rate at each wavelength, which follows absorption closely. Engelmann’s Cladophora experiment: bacteria gathered at blue and red light.','अवशोषण स्पेक्ट्रम: हर वर्णक द्वारा अवशोषित प्रकाश (नीले और लाल में शिखर)। क्रिया स्पेक्ट्रम: हर तरंगदैर्ध्य पर प्रकाश-संश्लेषण की दर, जो अवशोषण का लगभग अनुसरण करती है। एंगेलमान का क्लैडोफोरा प्रयोग: जीवाणु नीले और लाल प्रकाश में जमा हुए।'],
 s:['Pigments sit in light-harvesting antenna complexes that pass energy to a reaction centre: P680 in photosystem II, P700 in photosystem I.','वर्णक प्रकाश-संग्राही एंटीना समूहों में होते हैं जो ऊर्जा अभिक्रिया केंद्र को देते हैं: फोटोसिस्टम II में P680, फोटोसिस्टम I में P700।'],
 c:['The curves are schematic sketches, not measured data.','वक्र योजनाबद्ध रेखाचित्र हैं, मापे गए आँकड़े नहीं।']}},
{id:'light',n:['Light reactions','प्रकाश अभिक्रियाएँ'],v:pvZ,f:{
 d:['They occur in the thylakoid membranes and make ATP, NADPH and O₂.','ये थाइलेकॉइड झिल्लियों में होती हैं और ATP, NADPH तथा O₂ बनाती हैं।'],
 m:['Photosystem II (P680) is excited, splits water (photolysis: 2H₂O → 4H⁺ + 4e⁻ + O₂) and passes electrons down a chain to photosystem I (P700), which is excited again and reduces NADP⁺ to NADPH. Protons pile up in the thylakoid lumen and flow out through ATP synthase, making ATP (chemiosmosis).','फोटोसिस्टम II (P680) उत्तेजित होकर पानी तोड़ता है (प्रकाश-अपघटन: 2H₂O → 4H⁺ + 4e⁻ + O₂) और इलेक्ट्रॉन शृंखला से फोटोसिस्टम I (P700) तक पहुँचाता है, जो फिर उत्तेजित होकर NADP⁺ को NADPH में बदलता है। प्रोटॉन थाइलेकॉइड गुहा में जमा होकर ATP सिंथेज़ से बाहर बहते हैं और ATP बनता है (रसोपरासरण)।'],
 t:['Non-cyclic: both photosystems, gives ATP, NADPH and O₂. Cyclic: only photosystem I, gives ATP only, no NADPH and no O₂.','अचक्रीय: दोनों फोटोसिस्टम, ATP, NADPH और O₂ देता है। चक्रीय: केवल फोटोसिस्टम I, केवल ATP देता है; NADPH और O₂ नहीं।'],
 c:['The oxygen released comes from water, not from CO₂.','निकलने वाली ऑक्सीजन पानी से आती है, CO₂ से नहीं।']}},
{id:'calvin',n:['Calvin cycle','केल्विन चक्र'],v:()=>pvCycle([['RuBP (5C)','RuBP (5C)','x'],['2 × PGA (3C)','2 × PGA (3C)','x'],['G3P (3C)','G3P (3C)','x']],[['CO₂ + RuBisCO','CO₂ + रूबिस्को'],['ATP, NADPH','ATP, NADPH'],['ATP (regenerate)','ATP (पुनर्जनन)']]),f:{
 d:['It occurs in the stroma and builds sugar from CO₂ using ATP and NADPH.','यह स्ट्रोमा में होता है और ATP व NADPH से CO₂ द्वारा शर्करा बनाता है।'],
 m:['Carboxylation: RuBisCO attaches CO₂ to RuBP, giving PGA. Reduction: PGA becomes G3P using ATP and NADPH. Regeneration: RuBP is rebuilt using ATP.','कार्बोक्सिलन: रूबिस्को CO₂ को RuBP से जोड़ता है और PGA बनता है। अपचयन: ATP व NADPH से PGA, G3P बनता है। पुनर्जनन: ATP से RuBP फिर बनता है।'],
 x:['Per CO₂ fixed: 3 ATP and 2 NADPH. For one glucose (6 CO₂): 18 ATP and 12 NADPH. Overall: 6CO₂ + 12H₂O → C₆H₁₂O₆ + 6O₂ + 6H₂O.','प्रति CO₂: 3 ATP और 2 NADPH। एक ग्लूकोज़ (6 CO₂) के लिए: 18 ATP और 12 NADPH। कुल: 6CO₂ + 12H₂O → C₆H₁₂O₆ + 6O₂ + 6H₂O।'],
 c:['The “dark reactions” still need ATP and NADPH from the light reactions, so they stop in prolonged darkness.','“अँधेरी अभिक्रियाओं” को भी प्रकाश अभिक्रियाओं से ATP और NADPH चाहिए, इसलिए लंबे अँधेरे में वे रुक जाती हैं।']}},
{id:'c4',n:['C₄ pathway and Kranz anatomy','C₄ पथ और क्रांज़ शारीरिकी'],f:{
 d:['In C₄ plants the first stable product is oxaloacetic acid (4C). This is the Hatch–Slack pathway.','C₄ पौधों में पहला स्थायी उत्पाद ऑक्सैलोएसीटिक अम्ल (4C) है। यह हैच-स्लैक पथ है।'],
 s:['Kranz anatomy: large bundle sheath cells with chloroplasts form a wreath around each vein.','क्रांज़ शारीरिकी: शिरा के चारों ओर हरितलवक वाली बड़ी पूलाच्छद कोशिकाओं का घेरा।'],
 m:['In mesophyll cells PEP carboxylase fixes CO₂ into OAA and then malate. Malate moves to bundle sheath cells, releases CO₂, and RuBisCO runs the Calvin cycle in a CO₂-rich place.','पर्णमध्योतक में PEP कार्बोक्सिलेज़ CO₂ को OAA और फिर मैलेट में बाँधता है। मैलेट पूलाच्छद कोशिकाओं में जाकर CO₂ छोड़ता है और रूबिस्को CO₂-समृद्ध स्थान में केल्विन चक्र चलाता है।'],
 e:['Maize, sugarcane, sorghum.','मक्का, गन्ना, ज्वार।'],
 c:['C₄ costs more ATP (5 ATP and 2 NADPH per CO₂ against 3 and 2), but wins in hot, bright places.','C₄ में ATP अधिक लगता है (प्रति CO₂ 5 ATP व 2 NADPH, जबकि C₃ में 3 व 2), पर गर्म, तेज़ रोशनी में यह जीतता है।']}},
{id:'photoresp',n:['Photorespiration','प्रकाश-श्वसन'],f:{
 d:['RuBisCO can also use O₂ instead of CO₂ when O₂ is high and CO₂ is low, for example when stomata close in heat.','जब O₂ अधिक और CO₂ कम हो, जैसे गर्मी में रंध्र बंद होने पर, रूबिस्को CO₂ की जगह O₂ भी ले सकता है।'],
 m:['RuBP + O₂ gives one PGA and one phosphoglycolate. Rescuing the carbon needs chloroplast, peroxisome and mitochondrion, uses ATP and releases CO₂.','RuBP + O₂ से एक PGA और एक फॉस्फोग्लाइकोलेट बनता है। कार्बन बचाने में हरितलवक, परऑक्सीसोम और माइटोकॉन्ड्रिया लगते हैं, ATP खर्च होता है और CO₂ निकलती है।'],
 c:['It makes no sugar and no ATP, so it is a loss for C₃ plants. C₄ plants avoid most of it because CO₂ is concentrated. It is not the same as respiration.','इसमें शर्करा या ATP नहीं बनता, इसलिए C₃ पौधों के लिए हानि है। C₄ पौधे इससे अधिकांशतः बचते हैं क्योंकि CO₂ सांद्रित होती है। यह श्वसन नहीं है।']}},
{id:'cam',n:['CAM pathway','CAM पथ'],f:{
 m:['Stomata open at night: CO₂ is fixed into malic acid stored in the vacuole. By day the stomata stay shut, malic acid releases CO₂ and the Calvin cycle runs.','रात में रंध्र खुलते हैं: CO₂ मैलिक अम्ल में बँधकर रिक्तिका में जमा होती है। दिन में रंध्र बंद रहते हैं, मैलिक अम्ल से CO₂ निकलती है और केल्विन चक्र चलता है।'],
 e:['Opuntia, pineapple, Agave, Kalanchoe.','नागफनी, अनानास, एगेव, कलांचो।'],
 c:['CAM separates the two steps in time (night and day). C₄ separates them in space (two cell types).','CAM दोनों चरणों को समय में (रात-दिन) अलग करता है। C₄ उन्हें स्थान में (दो प्रकार की कोशिकाओं में) अलग करता है।']}},
{id:'c3c4cam',n:['C₃ vs C₄ vs CAM','C₃ बनाम C₄ बनाम CAM'],
 tb:{h:[['Feature','लक्षण'],['C₃','C₃'],['C₄','C₄'],['CAM','CAM']],r:[
  [['First product','पहला उत्पाद'],['PGA (3C)','PGA (3C)'],['OAA (4C)','OAA (4C)'],['Malic acid (night)','मैलिक अम्ल (रात)']],
  [['CO₂-fixing enzyme','CO₂ बाँधने वाला एंज़ाइम'],['RuBisCO','रूबिस्को'],['PEP carboxylase, then RuBisCO','PEP कार्बोक्सिलेज़, फिर रूबिस्को'],['PEP carboxylase at night, RuBisCO by day','रात में PEP कार्बोक्सिलेज़, दिन में रूबिस्को']],
  [['Anatomy','शारीरिकी'],['Normal','सामान्य'],['Kranz','क्रांज़'],['Succulent, big vacuoles','मांसल, बड़ी रिक्तिकाएँ']],
  [['Photorespiration','प्रकाश-श्वसन'],['High','अधिक'],['Very low','बहुत कम'],['Very low','बहुत कम']],
  [['Optimum temperature','अनुकूल तापमान'],['About 20–25 °C','लगभग 20–25 °C'],['About 30–45 °C','लगभग 30–45 °C'],['Warm, dry','गर्म, शुष्क']],
  [['Examples','उदाहरण'],['Wheat, rice, bean','गेहूँ, चावल, सेम'],['Maize, sugarcane','मक्का, गन्ना'],['Opuntia, pineapple','नागफनी, अनानास']]]},
 f:{x:['Try the C3/C4 switch in the Environment lab to see how the response changes.','पर्यावरण प्रयोगशाला में C3/C4 बदलकर देखें कि प्रतिक्रिया कैसे बदलती है।']}},
{id:'limiting',n:['Limiting factors (Blackman)','सीमाकारी कारक (ब्लैकमैन)'],f:{
 d:['Blackman’s law (1905): when several factors affect a process, its rate is set by the factor that is nearest its minimum.','ब्लैकमैन का नियम (1905): जब कई कारक किसी प्रक्रिया को प्रभावित करते हैं, तो उसकी दर उस कारक से तय होती है जो न्यूनतम के सबसे निकट है।'],
 t:['Light, CO₂, temperature and water. Light saturates at a low fraction of full sunlight in many C₃ plants; C₄ plants keep responding to temperature and light longer.','प्रकाश, CO₂, तापमान और पानी। कई C₃ पौधों में प्रकाश पूर्ण धूप के छोटे अंश पर संतृप्त हो जाता है; C₄ पौधे तापमान और प्रकाश पर अधिक देर तक प्रतिक्रिया करते हैं।'],
 x:['The Environment lab shows the current limiting factor.','पर्यावरण प्रयोगशाला वर्तमान सीमाकारी कारक दिखाती है।'],
 c:['Raising a factor that is not limiting changes nothing.','जो कारक सीमा नहीं है उसे बढ़ाने से कुछ नहीं बदलता।']}}
]});
