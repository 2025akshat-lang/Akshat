
const PV_INFO={};

Object.entries({
taproot:['मूसला जड़','Primary (tap) root','Main root growing straight down from the radicle.','Anchors the plant; absorbs water and minerals.','मूलांकुर (radicle) से बनी मुख्य जड़, सीधी नीचे जाती है।','पौधे को जकड़ती है; पानी व खनिज सोखती है।'],
lateral:['पार्श्व जड़ें','Lateral roots','Branches arising from the primary root.','Spread out and widen the absorbing area.','मुख्य जड़ से निकलने वाली शाखाएँ।','फैलकर सोखने का क्षेत्र बढ़ाती हैं।'],
rcap:['मूल गोप','Root cap (calyptra)','Thimble-like cover over the root tip.','Protects the growing tip as it pushes through soil.','जड़ के सिरे पर टोपी जैसा आवरण।','मिट्टी में बढ़ते सिरे की रक्षा करता है।'],
rhair:['मूल रोम','Root hairs','Tiny outgrowths of epidermal cells near the root tip.','Greatly increase the surface for absorbing water and minerals.','सिरे के पास अधिचर्म की कोशिकाओं की बारीक वृद्धियाँ।','पानी व खनिज सोखने की सतह बहुत बढ़ाते हैं।'],
internode:['तना (पर्व)','Stem / internode','Stem portion between two nodes.','Holds the plant up; carries water, minerals and food.','दो पर्वसंधियों के बीच का तने का भाग।','पौधे को सीधा रखता है; पानी, खनिज और भोजन पहुँचाता है।'],
node:['पर्वसंधि','Node','Point on the stem where leaves and buds arise.','Attachment site for leaves and branches.','तने का वह स्थान जहाँ से पत्तियाँ और कलियाँ निकलती हैं।','पत्तियों और शाखाओं के जुड़ने का स्थान।'],
branch:['शाखा','Branch','Side shoot that grows from an axillary bud.','Lets the plant carry more leaves and flowers.','कक्षीय कली से निकला पार्श्व तना।','पौधे पर पत्तियाँ और फूल बढ़ाती है।'],
abud:['शीर्ष कली','Apical (terminal) bud','Bud at the tip of the main shoot.','Makes the shoot grow longer.','मुख्य तने के सिरे की कली।','तने की लंबाई बढ़ाती है।'],
axbud:['कक्षीय कली','Axillary bud','Bud in the angle between leaf stalk and stem.','Can grow into a branch or a flower.','पत्ती के डंठल और तने के कोण पर स्थित कली।','शाखा या फूल में विकसित हो सकती है।'],
fbud:['पुष्प कली','Flower bud','Young, unopened flower.','Opens into a flower for reproduction.','अभी न खिला हुआ नया फूल।','खिलकर प्रजनन के लिए फूल बनती है।'],
trich:['रोम (ट्राइकोम)','Trichomes','Hair-like outgrowths of the epidermis.','Reduce water loss; can deter small herbivores.','अधिचर्म की रोम-जैसी वृद्धियाँ।','जल-हानि घटाते हैं; छोटे कीटों से बचाव कर सकते हैं।'],
blade:['पत्ती फलक','Leaf blade (lamina)','Flat green part of the leaf.','Main site of photosynthesis and gas exchange.','पत्ती का चपटा हरा भाग।','प्रकाश-संश्लेषण और गैस-विनिमय का मुख्य स्थान।'],
vein:['मध्य शिरा व शिराएँ','Midrib and veins','Vascular strands running through the blade.','Bring water in (xylem), carry sugars out (phloem), give support.','फलक में फैली संवहन धाराएँ।','जाइलम से पानी लाती हैं, फ्लोएम से शर्करा ले जाती हैं; सहारा देती हैं।'],
petiole:['पर्णवृंत','Petiole','Stalk joining the blade to the stem.','Holds the blade towards light; conducts materials.','फलक को तने से जोड़ने वाला डंठल।','फलक को रोशनी की ओर रखता है; पदार्थ पहुँचाता है।'],
lbase:['पर्णाधार','Leaf base','Part where the leaf attaches to the stem.','Attaches the leaf; may bear stipules.','पत्ती के तने से जुड़ने का भाग।','पत्ती को जोड़ता है; इस पर अनुपर्ण हो सकते हैं।'],
stipule:['अनुपर्ण','Stipules','Small leaf-like outgrowths at the leaf base (not in all plants).','Protect the young leaf.','पर्णाधार पर छोटी पत्ती-जैसी वृद्धियाँ (सभी पौधों में नहीं)।','कोमल पत्ती की रक्षा करते हैं।'],
petal:['दल (पंखुड़ियाँ)','Petals (corolla)','Often brightly coloured inner whorl of the flower.','Attract pollinators.','फूल का प्रायः रंगीन भीतरी चक्र।','परागण करने वाले जीवों को आकर्षित करती हैं।'],
sepal:['बाह्यदल','Sepals (calyx)','Outer, usually green whorl of the flower.','Protect the flower bud.','फूल का बाहरी, प्रायः हरा चक्र।','कली अवस्था में फूल की रक्षा करते हैं।'],
stamen:['पुंकेसर','Stamen (male part)','A filament bearing an anther.','Anther makes pollen grains.','तंतु और उस पर परागकोश।','परागकोश में परागकण बनते हैं।'],
carpel:['अंडप (स्त्रीकेसर)','Carpel (female part)','Stigma, style and ovary.','Stigma receives pollen; ovules in the ovary become seeds.','वर्तिकाग्र, वर्तिका और अंडाशय।','वर्तिकाग्र परागकण ग्रहण करता है; अंडाशय के बीजांड बीज बनते हैं।'],
pericarp:['फलभित्ति','Fruit wall (pericarp)','Wall that develops from the ovary wall.','Protects the seeds and helps their dispersal.','अंडाशय की भित्ति से बनी फल की दीवार।','बीजों की रक्षा करती है; प्रकीर्णन में मदद करती है।'],
flesh:['गूदा','Flesh (fleshy pericarp)','Soft inner part of the fruit wall.','Stores food; attracts animals that spread seeds.','फलभित्ति का मुलायम भीतरी भाग।','भोजन जमा करता है; बीज फैलाने वाले जंतुओं को आकर्षित करता है।'],
fseed:['बीज','Seeds','Ovules that matured after fertilisation.','Each can grow into a new plant.','निषेचन के बाद परिपक्व हुए बीजांड।','हर बीज नया पौधा बन सकता है।'],
calyx:['बाह्यदलपुंज','Calyx on fruit','Sepals that stay at the stalk end of the fruit.','Protect the young fruit.','फल के डंठल की ओर बचे रहने वाले बाह्यदल।','छोटे फल की रक्षा करते हैं।'],
pedicel:['पुष्पवृंत','Pedicel','Stalk holding the flower or fruit.','Supports the fruit; supplies water and food.','फूल या फल को थामने वाला डंठल।','फल को सहारा देता है; पानी-भोजन पहुँचाता है।'],
seed:['बीज','Seed','Embryo with stored food inside a seed coat.','Grows into a new plant on germination.','बीजचोल के भीतर भ्रूण और संचित भोजन।','अंकुरण पर नया पौधा बनता है।'],
soil:['मिट्टी','Soil layers','Topsoil, subsoil, weathered rock and bedrock, top to bottom.','Gives anchorage, water and minerals to roots.','ऊपर से नीचे: ऊपरी मिट्टी, उप-मृदा, अपक्षयित चट्टान, आधारशिला।','जड़ों को सहारा, पानी और खनिज देती है।']
}).forEach(([k,v])=>PV_INFO[k]={hi:v[0],sci:v[1],a:v[2],f:v[3],ah:v[4],fh:v[5]});

const PV_LABHI={'Petals':'दल','Carpel':'अंडप','Stamens':'पुंकेसर','Sepals':'बाह्यदल','Leaf blade':'पत्ती फलक','Petiole':'पर्णवृंत','Leaf base':'पर्णाधार','Stipules':'अनुपर्ण','Node':'पर्वसंधि','Main stem':'मुख्य तना','Branch':'शाखा','Apical bud':'शीर्ष कली','Axillary bud':'कक्षीय कली','Flower bud':'पुष्प कली','Trichomes':'रोम','Fruit wall':'फलभित्ति','Seeds':'बीज','Primary root':'मूसला जड़','Lateral roots':'पार्श्व जड़ें','Root hairs':'मूल रोम','Root cap':'मूल गोप','Seed':'बीज','New plant':'नया पौधा','Bee':'मधुमक्खी','Grass':'घास','Topsoil':'ऊपरी मिट्टी','Subsoil':'उप-मृदा','Weathered rock':'अपक्षयित चट्टान','Bedrock':'आधारशिला'};
