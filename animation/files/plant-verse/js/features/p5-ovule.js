
SC['ovule']=()=>{
  const S=new Sc(),L=PV.L,add=(id,g,m,x,y,z,par)=>S.add(id,mesh(g,m,x,y,z),par),pt=(id,en,hi,de,dh)=>S.part(id,L(en,hi),L(de,dh));
  S.title=L('Ovule: inside','बीजांड: भीतर की संरचना');S.cam=6.5;S.group.rotation.set(.2,.5,0);
  S.note=L('Simplified, straight (orthotropous) drawing. Many ovules curve so that the micropyle lies near the stalk (anatropous).','सरलीकृत, सीधा (ऑर्थोट्रोपस) चित्र। कई बीजांड मुड़े होते हैं जिससे बीजांडद्वार डंठल के पास आ जाता है (एनाट्रोपस)।');
  pt('funicle','Funicle','बीजांडवृंत','Stalk that attaches the ovule to the placenta.','वह डंठल जो बीजांड को अपरा (प्लेसेंटा) से जोड़ता है।');
  pt('hilum','Hilum','नाभिका (हाइलम)','Junction where the ovule joins the funicle.','वह जोड़ जहाँ बीजांड बीजांडवृंत से मिलता है।');
  pt('outer','Outer integument','बाह्य अध्यावरण','Outer protective covering. After fertilisation the integuments become the seed coat.','बाहरी रक्षी आवरण। निषेचन के बाद अध्यावरण बीजचोल बनते हैं।');
  pt('inner','Inner integument','आंतरिक अध्यावरण','Inner protective covering around the nucellus.','बीजांडकाय के चारों ओर भीतरी रक्षी आवरण।');
  pt('micropyle','Micropyle','बीजांडद्वार (माइक्रोपाइल)','Small opening in the integuments. The pollen tube usually enters through it; later water enters the seed here.','अध्यावरणों में छोटा छिद्र। पराग नलिका प्रायः यहीं से प्रवेश करती है; बाद में बीज में पानी भी यहीं से जाता है।');
  pt('nucellus','Nucellus','बीजांडकाय (न्यूसेलस)','Tissue inside the integuments that nourishes the embryo sac. It is the megasporangium.','अध्यावरणों के भीतर का ऊतक जो भ्रूणकोष को पोषण देता है। यह गुरुबीजाणुधानी है।');
  pt('es','Embryo sac','भ्रूणकोष','The female gametophyte, formed from a megaspore. It holds the egg cell.','गुरुबीजाणु से बना मादा युग्मकोद्भिद। इसमें अंड कोशिका होती है।');
  pt('chalaza','Chalaza','निभाग (कैलेज़ा)','Basal end of the ovule, opposite the micropyle, where integuments and nucellus join.','बीजांड का आधार-सिरा, बीजांडद्वार के विपरीत, जहाँ अध्यावरण और बीजांडकाय जुड़ते हैं।');
  const G=new T.Group();G.scale.set(1,1.4,.9);S.group.add(G);
  [['outer',1,0xa5d6a7,.35],['inner',.85,0x66bb6a,.4],['nucellus',.7,0xffe082,.4]].forEach(a=>cutSphere(S,a[0],a[1],M(a[2],{transparent:true,opacity:a[3]}),G));
  add('es',new T.SphereGeometry(.38,20,14),M(0xf48fb1,{transparent:true,opacity:.65}),0,.4,0).scale.set(.8,1.4,.8);
  add('micropyle',new T.TorusGeometry(.11,.035,8,20).rotateX(Math.PI/2),M(0x3e2723),0,1.4,0);
  add('chalaza',new T.SphereGeometry(.2,14,10),M(0x8d6e63),0,-1.15,0);
  add('hilum',new T.CylinderGeometry(.22,.22,.05,18),M(0x5d4037),0,-1.42,0);
  add('funicle',new T.CylinderGeometry(.12,.12,.6,12),M(0x7cb342),0,-1.72,0);
  return S};
function pvSac(fert){
  const S=new Sc(),L=PV.L,add=(id,g,m,x,y,z)=>S.add(id,mesh(g,m,x,y,z)),pt=(id,en,hi,de,dh)=>S.part(id,L(en,hi),L(de,dh));
  S.title=fert?L('Double fertilisation','दोहरा निषेचन'):L('Embryo sac (7 cells, 8 nuclei)','भ्रूणकोष (7 कोशिकाएँ, 8 केंद्रक)');S.cam=6.2;S.group.rotation.set(.2,.35,0);
  S.note=fert?L('Simplified. One male gamete fuses with the egg (zygote, 2n), the other with the two polar nuclei (triple fusion, 3n). The zygote becomes the embryo; the 3n cell becomes the endosperm.','सरलीकृत। एक नर युग्मक अंड से मिलता है (युग्मनज, 2n) और दूसरा दोनों ध्रुवीय केंद्रकों से (त्रिक संलयन, 3n)। युग्मनज भ्रूण बनता है; 3n कोशिका भ्रूणपोष बनती है।')
    :L('Typical (Polygonum-type) embryo sac. Micropylar end at the top, chalazal end at the bottom.','विशिष्ट (पॉलीगोनम-प्रकार) भ्रूणकोष। ऊपर बीजांडद्वार वाला सिरा, नीचे निभाग वाला सिरा।');
  pt('wall','Embryo sac wall','भ्रूणकोष की भित्ति','Boundary of the embryo sac inside the nucellus.','बीजांडकाय के भीतर भ्रूणकोष की सीमा।');
  pt('egg','Egg cell','अंड कोशिका','The female gamete, at the micropylar end. Fusion with a male gamete forms the zygote.','मादा युग्मक, बीजांडद्वार वाले सिरे पर। नर युग्मक से मिलकर युग्मनज बनाती है।');
  pt('syn','Synergids','सहायक कोशिकाएँ','Two cells beside the egg. They guide the pollen tube to the egg.','अंड के पास दो कोशिकाएँ। पराग नलिका को अंड तक पहुँचाने में मार्गदर्शन करती हैं।');
  pt('cc','Central cell','केंद्रीय कोशिका','Large cell that holds the two polar nuclei. It becomes the endosperm after fertilisation.','बड़ी कोशिका जिसमें दो ध्रुवीय केंद्रक होते हैं। निषेचन के बाद भ्रूणपोष बनती है।');
  pt('pn','Polar nuclei','ध्रुवीय केंद्रक','Two nuclei in the central cell. A male gamete fuses with them (triple fusion).','केंद्रीय कोशिका के दो केंद्रक। एक नर युग्मक इनसे मिलता है (त्रिक संलयन)।');
  pt('anti','Antipodal cells','प्रतिव्यासांत कोशिकाएँ','Three cells at the chalazal end. They are usually short-lived.','निभाग वाले सिरे पर तीन कोशिकाएँ। प्रायः अल्पजीवी होती हैं।');
  if(fert){pt('tube','Pollen tube','पराग नलिका','Tube that grows from the pollen grain through the micropyle and delivers two male gametes into the embryo sac.','परागकण से बीजांडद्वार होकर बढ़ने वाली नलिका जो दो नर युग्मकों को भ्रूणकोष में पहुँचाती है।');
    pt('sperm','Male gametes','नर युग्मक','Two male gametes: one fuses with the egg, the other with the polar nuclei.','दो नर युग्मक: एक अंड से और दूसरा ध्रुवीय केंद्रकों से मिलता है।')}
  const G=new T.Group();G.scale.set(1,1.6,.9);S.group.add(G);cutSphere(S,'wall',1,M(0xf8bbd0,{transparent:true,opacity:.3}),G);
  add('cc',new T.SphereGeometry(.6,20,14),M(0xfff59d,{transparent:true,opacity:.35}),0,-.05,0).scale.set(1,1.4,.9);
  [[-.1,.2,.1],[.12,.05,.1]].forEach(p=>add('pn',new T.SphereGeometry(.1,12,10),M(0x6a1b9a),p[0],p[1],p[2]));
  add('egg',new T.SphereGeometry(.2,16,12),M(0xffd54f),0,1.0,.1).scale.set(1,1.25,1);add('egg',new T.SphereGeometry(.07,10,8),M(0x6a1b9a),0,1.0,.28);
  [-.3,.3].forEach(x=>{add('syn',new T.SphereGeometry(.14,14,10),M(0x90caf9),x,1.15,0).scale.set(.8,1.4,.8);add('syn',new T.SphereGeometry(.05,8,6),M(0x6a1b9a),x,1.1,.12)});
  [[-.28,-1.15,0],[.28,-1.15,0],[0,-1.3,.2]].forEach(p=>{add('anti',new T.SphereGeometry(.15,14,10),M(0x66bb6a),p[0],p[1],p[2]);add('anti',new T.SphereGeometry(.05,8,6),M(0x6a1b9a),p[0],p[1],p[2]+.12)});
  if(fert){const c=new T.CatmullRomCurve3([new T.Vector3(.5,3,0),new T.Vector3(.35,2.2,0),new T.Vector3(.3,1.6,.05),new T.Vector3(.3,1.2,.05)]);
    add('tube',new T.TubeGeometry(c,24,.07,8),M(0x7cb342));
    add('sperm',new T.SphereGeometry(.06,10,8),M(0x1565c0),.12,.82,.2).scale.set(1.8,1,1);add('sperm',new T.SphereGeometry(.06,10,8),M(0x1565c0),.05,.45,.2).scale.set(1.8,1,1)}
  return S}
SC['embryo-sac']=()=>pvSac(false);SC['fertilisation']=()=>pvSac(true);
