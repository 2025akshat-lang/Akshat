
function pvSig(){const L=PV.L,X=t=>20+t*210,Y=v=>90-v*70,pts=Array.from({length:41},(_,i)=>{const t=i/40;return X(t).toFixed(1)+','+Y(1/(1+Math.exp(-(t-.5)*10))).toFixed(1)}).join(' ');
  return [[0,.3,'#e1f5fe',L('Lag','मंद')],[.3,.7,'#c8e6c9',L('Log (exponential)','चरघातांकी')],[.7,1,'#fff9c4',L('Stationary','स्थिर')]].map(z=>`<rect x="${X(z[0])}" y="15" width="${X(z[1])-X(z[0])}" height="75" fill="${z[2]}"/><text x="${(X(z[0])+X(z[1]))/2}" y="25" font-size="6.5" text-anchor="middle" fill="#1b1b1b">${z[3]}</text>`).join('')
   +`<line x1="20" y1="90" x2="230" y2="90" stroke="var(--fg)" stroke-width=".7"/><line x1="20" y1="15" x2="20" y2="90" stroke="var(--fg)" stroke-width=".7"/><polyline fill="none" stroke="#2e7d32" stroke-width="1.8" points="${pts}"/>`
   +`<text x="125" y="104" font-size="6" text-anchor="middle" fill="var(--fg)">${L('Time','समय')}</text><text x="8" y="55" font-size="6" fill="var(--fg)" transform="rotate(-90 8 55)" text-anchor="middle">${L('Size','आकार')}</text>`}
PV.theory.add({id:'growth',i:'📈',n:['Growth and hormones','वृद्धि और हार्मोन'],t:[
{id:'gphases',n:['Growth phases and the growth curve','वृद्धि की अवस्थाएँ और वृद्धि वक्र'],v:pvSig,f:{
 d:['Growth is a permanent increase in size. In a root or shoot tip it has three zones: cell division (meristematic), elongation, and maturation.','वृद्धि आकार में स्थायी बढ़ोतरी है। जड़ या प्ररोह के सिरे पर तीन क्षेत्र होते हैं: कोशिका विभाजन (विभज्योतकी), दीर्घन और परिपक्वन।'],
 m:['A whole organism or organ follows an S-shaped (sigmoid) curve: slow lag phase, fast log phase, then a stationary phase as growth slows.','पूरा जीव या अंग S-आकार (सिग्मॉइड) वक्र पर चलता है: धीमी मंद अवस्था, तेज़ चरघातांकी अवस्था, फिर वृद्धि धीमी होकर स्थिर अवस्था।'],
 c:['Plants keep growing throughout life from meristems (open growth). Plasticity lets one plant take different forms, such as heterophylly.','पौधे जीवन भर विभज्योतकों से बढ़ते रहते हैं (अनिश्चित वृद्धि)। प्लास्टिसिटी से एक ही पौधा अलग रूप ले सकता है, जैसे विषमपर्णता।']}},
{id:'grates',n:['Growth rates and types','वृद्धि दर और प्रकार'],f:{
 d:['Absolute growth rate (AGR) = increase in size ÷ time. Relative growth rate (RGR) = increase ÷ initial size ÷ time, often as a percentage.','निरपेक्ष वृद्धि दर (AGR) = आकार में वृद्धि ÷ समय। सापेक्ष वृद्धि दर (RGR) = वृद्धि ÷ प्रारंभिक आकार ÷ समय, प्रायः प्रतिशत में।'],
 t:['Arithmetic growth: only one daughter cell keeps dividing, so length rises steadily (Lt = L₀ + rt), as in a root growing at constant rate. Geometric growth: both daughter cells divide, so growth is exponential (W₁ = W₀eʳᵗ).','अंकगणितीय वृद्धि: केवल एक पुत्री कोशिका विभाजित होती रहती है, इसलिए लंबाई एक-सी दर से बढ़ती है (Lt = L₀ + rt)। ज्यामितीय वृद्धि: दोनों पुत्री कोशिकाएँ विभाजित होती हैं, इसलिए वृद्धि चरघातांकी (W₁ = W₀eʳᵗ)।'],
 x:['Try the Numericals lab for AGR and RGR sums.','AGR और RGR के प्रश्नों के लिए अंकगणित प्रयोगशाला आज़माएँ।'],
 c:['A seedling that adds 2 cm to 4 cm and one that adds 2 cm to 40 cm have the same AGR but very different RGR.','जो अंकुर 4 सेमी में 2 सेमी जोड़ता है और जो 40 सेमी में 2 सेमी जोड़ता है, उनकी AGR समान पर RGR बहुत अलग होती है।']}},
{id:'auxin',n:['Auxins','ऑक्सिन'],f:{
 s:['Made in shoot tips and young leaves (IAA). Moves from tip to base (polar transport). Others: IBA, NAA, 2,4-D.','प्ररोह के सिरे और नई पत्तियों में बनता है (IAA)। सिरे से आधार की ओर जाता है (ध्रुवीय परिवहन)। अन्य: IBA, NAA, 2,4-D।'],
 m:['Cell elongation, apical dominance, roots on cuttings, flowering in pineapple, parthenocarpy, and delaying fall of young leaves and fruits.','कोशिका दीर्घन, शीर्ष प्रभाविता, कलम में जड़ें, अनानास में पुष्पन, अनिषेकफलन, और नई पत्तियों व फलों का झड़ना टालना।'],
 x:['2,4-D kills broad-leaved (dicot) weeds in cereal fields. Went’s Avena curvature test measured auxin.','2,4-D अनाज के खेत में चौड़ी पत्ती (द्विबीजपत्री) खरपतवार मारता है। वेंट के जई (एवेना) परीक्षण से ऑक्सिन मापा गया।']}},
{id:'gibb',n:['Gibberellins','जिबरेलिन'],f:{
 s:['Made in young leaves and embryos. First found from the fungus Gibberella (bakanae disease of rice).','नई पत्तियों और भ्रूण में बनता है। सबसे पहले कवक जिबरेला (धान का बकानी रोग) से मिला।'],
 m:['Stem elongation (bolting in rosette plants like cabbage), breaking seed dormancy, α-amylase in barley seeds for malting, and seedless fruit.','तने का दीर्घन (पत्तागोभी जैसे रोज़ेट पौधों में बोल्टिंग), बीज की सुषुप्ति तोड़ना, माल्टिंग के लिए जौ में α-एमाइलेज़, और बीज-रहित फल।'],
 x:['Sprayed on sugarcane to raise stem length and sugar yield, and on grapes to lengthen stalks.','गन्ने पर छिड़कने से तने की लंबाई और चीनी उपज बढ़ती है, अंगूर पर डंठल लंबे होते हैं।']}},
{id:'cytok',n:['Cytokinins','साइटोकाइनिन'],f:{
 s:['Made where cells divide fast: root tips, young fruits, shoot buds. Kinetin came from herring-sperm DNA; zeatin from maize.','जहाँ कोशिकाएँ तेज़ी से विभाजित होती हैं वहाँ बनते हैं: जड़ का सिरा, कच्चे फल, प्ररोह कलियाँ। काइनेटिन हेरिंग मछली के शुक्राणु DNA से मिला; ज़ीएटिन मक्के से।'],
 m:['Cell division, new shoots in tissue culture, release of side buds (against apical dominance) and slowing leaf ageing.','कोशिका विभाजन, ऊतक संवर्धन में नए प्ररोह, पार्श्व कलियों का खुलना (शीर्ष प्रभाविता के विरुद्ध) और पत्ती का बूढ़ा होना धीमा करना।'],
 c:['More auxin than cytokinin favours roots; more cytokinin favours shoots (Skoog and Miller).','कम साइटोकाइनिन और अधिक ऑक्सिन से जड़ें; अधिक साइटोकाइनिन से प्ररोह बनते हैं (स्कूग व मिलर)।']}},
{id:'aba',n:['Abscisic acid (ABA)','एब्सिसिक अम्ल (ABA)'],f:{
 s:['Made in leaves (in chloroplasts) and rises under stress, so it is called the stress hormone.','पत्तियों में (हरितलवकों में) बनता है और तनाव में बढ़ता है, इसलिए इसे तनाव हार्मोन कहते हैं।'],
 m:['Closes stomata in water stress, helps seeds mature and stay dormant, and slows growth.','जल-तनाव में रंध्र बंद करता है, बीजों को परिपक्व होने व सुषुप्त रहने में मदद करता है और वृद्धि धीमी करता है।'],
 c:['ABA works against gibberellins in seed dormancy and germination.','बीज की सुषुप्ति और अंकुरण में ABA, जिबरेलिन के विपरीत काम करता है।']}},
{id:'ethylene',n:['Ethylene','एथिलीन'],f:{
 s:['A gas made in ripening fruits and ageing tissues.','पके फलों और बूढ़े होते ऊतकों में बनने वाली गैस।'],
 m:['Fruit ripening, leaf and flower fall (abscission), ageing, breaking dormancy in potato tubers and peanut seeds, and flowering in mango and pineapple.','फल पकना, पत्ती-फूल झड़ना (विलगन), बुढ़ापा, आलू के कंद और मूँगफली के बीज की सुषुप्ति तोड़ना, और आम व अनानास में पुष्पन।'],
 x:['Ethephon, a liquid that releases ethylene, is sprayed on fruits to ripen them.','एथेफॉन, जो एथिलीन छोड़ता है, फलों को पकाने के लिए छिड़का जाता है।'],
 c:['One ripe fruit can ripen others nearby because ethylene is a gas.','एक पका फल पास के फलों को पका सकता है क्योंकि एथिलीन गैस है।']}},
{id:'hormsum',n:['Hormones at a glance','हार्मोन एक नज़र में'],
 tb:{h:[['Hormone','हार्मोन'],['Chief effect','मुख्य प्रभाव'],['Made in','कहाँ बनता है']],r:[
  [['Auxin','ऑक्सिन'],['Elongation, apical dominance','दीर्घन, शीर्ष प्रभाविता'],['Shoot tip','प्ररोह सिरा']],[['Gibberellin','जिबरेलिन'],['Stem growth, break dormancy','तना वृद्धि, सुषुप्ति भंग'],['Young leaves, embryo','नई पत्तियाँ, भ्रूण']],
  [['Cytokinin','साइटोकाइनिन'],['Cell division, delay ageing','कोशिका विभाजन, बुढ़ापा टालना'],['Root tip','जड़ का सिरा']],[['ABA','ABA'],['Stomatal closure, dormancy','रंध्र बंद, सुषुप्ति'],['Leaves','पत्तियाँ']],
  [['Ethylene','एथिलीन'],['Ripening, abscission','पकना, विलगन'],['Ripe fruit, old tissue','पका फल, पुराना ऊतक']]]}},
{id:'tropism',n:['Tropisms','अनुवर्तन'],f:{
 d:['Directional growth in response to a stimulus: phototropism (light), gravitropism (gravity), hydrotropism (water), thigmotropism (touch).','उद्दीपन के प्रति दिशात्मक वृद्धि: प्रकाशानुवर्तन (प्रकाश), गुरुत्वानुवर्तन (गुरुत्व), जलानुवर्तन (जल), स्पर्शानुवर्तन (स्पर्श)।'],
 m:['Auxin moves to the shaded side of a shoot, so cells there elongate more and the shoot bends toward light. Roots are the opposite: they bend away from light and toward gravity and water.','ऑक्सिन प्ररोह की छायादार ओर चला जाता है, वहाँ की कोशिकाएँ अधिक लंबी होती हैं और प्ररोह प्रकाश की ओर मुड़ता है। जड़ें उलटी हैं: वे प्रकाश से दूर और गुरुत्व व पानी की ओर मुड़ती हैं।'],
 e:['Tendrils coil by touch (thigmotropism). Darwin’s canary-grass coleoptile experiment showed that the tip senses light.','प्रतान स्पर्श से लिपटते हैं (स्पर्शानुवर्तन)। डार्विन के कैनरी-घास कोलियोप्टाइल प्रयोग ने दिखाया कि सिरा प्रकाश को महसूस करता है।']}},
{id:'photoper',n:['Photoperiodism and vernalisation','दीप्तिकालिता और बसंतीकरण'],f:{
 t:['Short-day plants flower when nights are long enough (rice, chrysanthemum, Xanthium). Long-day plants need short nights (wheat, spinach). Day-neutral plants flower regardless (tomato, maize, cotton).','लघु-दिवस पौधे तब फूलते हैं जब रातें पर्याप्त लंबी हों (धान, गुलदाउदी, ज़ैन्थियम)। दीर्घ-दिवस पौधों को छोटी रातें चाहिए (गेहूँ, पालक)। दिवस-उदासीन पौधे किसी भी स्थिति में फूलते हैं (टमाटर, मक्का, कपास)।'],
 m:['Leaves sense the night length with phytochrome. Vernalisation is a cold treatment that lets some plants flower, such as winter wheat and biennials like cabbage and carrot.','पत्तियाँ फाइटोक्रोम से रात की लंबाई जानती हैं। बसंतीकरण वह ठंडा उपचार है जिससे कुछ पौधे फूलते हैं, जैसे शीतकालीन गेहूँ और द्विवर्षी पौधे (पत्तागोभी, गाजर)।'],
 c:['It is the length of the uninterrupted dark period that matters. A flash of light in the night can stop a short-day plant from flowering.','मायने रखती है बिना रुकावट वाले अंधकार की अवधि। रात में प्रकाश की एक झलक लघु-दिवस पौधे को फूलने से रोक सकती है।']}},
{id:'senesc',n:['Senescence and abscission','जीर्णता और विलगन'],f:{
 d:['Senescence is programmed ageing. Chlorophyll breaks down, leaves turn yellow and nutrients move back into the plant.','जीर्णता योजनाबद्ध बुढ़ापा है। क्लोरोफिल टूटता है, पत्तियाँ पीली पड़ती हैं और पोषक तत्व पौधे में वापस चले जाते हैं।'],
 m:['Abscission: an abscission layer forms at the base of a leaf, flower or fruit stalk and the part falls. Ethylene and ABA promote this; auxin and cytokinin delay it.','विलगन: पत्ती, फूल या फल के डंठल के आधार पर विलगन परत बनती है और वह भाग गिर जाता है। एथिलीन व ABA इसे बढ़ाते हैं; ऑक्सिन व साइटोकाइनिन इसे टालते हैं।']}}
]});
