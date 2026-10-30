
SC['anther']=()=>{
  const S=new Sc(),L=PV.L,add=(id,g,m,x,y,z)=>S.add(id,mesh(g,m,x,y,z)),pt=(id,en,hi,de,dh)=>S.part(id,L(en,hi),L(de,dh)),D={side:T.DoubleSide};
  S.title=L('Anther: cross-section (T.S.)','परागकोश: अनुप्रस्थ काट');S.cam=6.4;S.group.rotation.set(.45,.55,0);
  S.note=L('A typical anther has two lobes and four pollen sacs (microsporangia). Tap a part or use the chips.','विशिष्ट परागकोश में दो पालियाँ और चार पराग-कोष (लघुबीजाणुधानी) होते हैं। किसी भाग को छुएँ या चिप दबाएँ।');
  pt('epi','Epidermis','अधिचर्म','Outermost protective layer of the anther wall.','परागकोश भित्ति की सबसे बाहरी रक्षी परत।');
  pt('endo','Endothecium','अंतस्थीसियम','Layer below the epidermis. Its thickened cells help the anther wall split open (dehisce) and release pollen.','अधिचर्म के नीचे की परत। इसकी मोटी कोशिकाएँ परागकोश को फटने (स्फुटन) में मदद करती हैं जिससे पराग निकलते हैं।');
  pt('tap','Tapetum','टेपेटम','Innermost wall layer. It nourishes the developing pollen grains.','भित्ति की सबसे भीतरी परत। विकसित हो रहे परागकणों को पोषण देती है।');
  pt('sac','Pollen sac (microsporangium)','पराग-कोष (लघुबीजाणुधानी)','Chamber where pollen grains form and mature. Each anther lobe has two.','वह कक्ष जहाँ परागकण बनते और परिपक्व होते हैं। हर पाली में दो होते हैं।');
  pt('pollen','Pollen grains','परागकण','Male gametophytes made from microspores inside the pollen sac.','पराग-कोष के भीतर लघुबीजाणुओं से बने नर युग्मकोद्भिद।');
  pt('conn','Connective','योजी (कनेक्टिव)','Sterile tissue joining the two lobes and holding the vascular bundle.','दोनों पालियों को जोड़ने वाला बंध्य ऊतक, जिसमें संवहन बंडल होता है।');
  pt('vb','Vascular bundle','संवहन बंडल','Brings water and food to the anther through the filament.','तंतु (फिलामेंट) से होकर परागकोश तक पानी और भोजन पहुँचाता है।');
  add('conn',new T.BoxGeometry(.5,1.9,1.2),M(0xe8f5e9),0,0,0);
  add('vb',new T.CylinderGeometry(.09,.09,1.3,12).rotateX(Math.PI/2),M(0xc62828),0,0,0);
  const P=[[-.75,.55],[.75,.55],[-.75,-.55],[.75,-.55]];
  [['epi',.5,0xa5d6a7,{}],['endo',.43,0xffcc80,{}],['tap',.36,0xce93d8,{}],['sac',.3,0xfff9c4,{transparent:true,opacity:.4}]].forEach(a=>P.forEach(p=>add(a[0],new T.CylinderGeometry(a[1],a[1],1.2,32,1,true).rotateX(Math.PI/2),M(a[2],Object.assign({side:T.DoubleSide},a[3])),p[0],p[1],0)));
  P.forEach(p=>{for(let i=0;i<7;i++){const a=rnd()*6.28,r=rnd()*.22;add('pollen',new T.SphereGeometry(.06,10,8),M(0xfdd835),p[0]+Math.cos(a)*r,p[1]+Math.sin(a)*r,.05+rnd()*.5)}});
  return S};
SC['pollen']=()=>{
  const S=new Sc(),L=PV.L,add=(id,g,m,x,y,z)=>S.add(id,mesh(g,m,x,y,z)),pt=(id,en,hi,de,dh)=>S.part(id,L(en,hi),L(de,dh));
  S.title=L('Pollen grain: inside','परागकण: भीतर की संरचना');S.cam=5;S.group.rotation.set(.3,.5,0);
  S.note=L('Simplified: size, surface pattern and number of pores differ in every species. Many pollen grains shed with two cells; the generative cell divides into two male gametes in the grain or in the pollen tube.','सरलीकृत: हर प्रजाति में आकार, सतह का पैटर्न और छिद्रों की संख्या अलग होती है। कई परागकण दो कोशिकाओं के साथ झड़ते हैं; जनन कोशिका परागकण में या पराग नलिका में विभाजित होकर दो नर युग्मक बनाती है।');
  pt('exine','Exine','बाह्यचोल (एक्ज़ाइन)','Hard outer wall of sporopollenin, one of the toughest natural materials. It resists heat, acid and enzymes, so pollen fossils survive.','स्पोरोपोलेनिन की कठोर बाहरी भित्ति, जो अत्यंत टिकाऊ पदार्थों में से है। गर्मी, अम्ल और एंज़ाइम सहन करती है, इसलिए परागकणों के जीवाश्म बचे रहते हैं।');
  pt('pore','Germ pore','जनन छिद्र','Spot where the exine is missing. The pollen tube comes out through it.','वह स्थान जहाँ बाह्यचोल नहीं होता। पराग नलिका यहीं से बाहर निकलती है।');
  pt('intine','Intine','अंतःचोल (इंटाइन)','Thin inner wall of cellulose and pectin. It grows out as the pollen tube.','सेलुलोज़ और पेक्टिन की पतली भीतरी भित्ति। यही पराग नलिका के रूप में बढ़ती है।');
  pt('veg','Vegetative cell','कायिक कोशिका','Large cell with food reserves. It makes the pollen tube grow.','भोजन भंडार वाली बड़ी कोशिका। पराग नलिका को बढ़ाती है।');
  pt('vnuc','Vegetative nucleus','कायिक केंद्रक','Large nucleus that directs growth of the pollen tube.','बड़ा केंद्रक जो पराग नलिका की वृद्धि को निर्देशित करता है।');
  pt('gen','Generative cell','जनन कोशिका','Small spindle-shaped cell. It divides to form the two male gametes.','छोटी तर्कु-आकार कोशिका। विभाजित होकर दो नर युग्मक बनाती है।');
  const G=new T.Group();S.group.add(G);
  [['exine',1,0xffb300,.45],['intine',.92,0x81c784,.4],['veg',.86,0xfff59d,.35]].forEach(a=>cutSphere(S,a[0],a[1],M(a[2],{transparent:true,opacity:a[3]}),G));
  const Y=new T.Vector3(0,1,0);
  for(let i=0;i<45;i++){const y=1-2*(i+.5)/45,r=Math.sqrt(1-y*y),t=i*2.39996,x=Math.cos(t)*r,z=Math.sin(t)*r;if(x<0&&z>0)continue;
    const m=add('exine',new T.ConeGeometry(.05,.14,5),M(0xff8f00),x*1.03,y*1.03,z*1.03);m.quaternion.setFromUnitVectors(Y,new T.Vector3(x,y,z))}
  const n=new T.Vector3(.7,.3,.65).normalize(),pm=add('pore',new T.CylinderGeometry(.2,.2,.05,20),M(0x4e342e),n.x*.99,n.y*.99,n.z*.99);pm.quaternion.setFromUnitVectors(Y,n);
  add('vnuc',new T.SphereGeometry(.22,18,14),M(0x6a1b9a),-.25,-.15,-.1);
  add('gen',new T.SphereGeometry(.15,14,10),M(0xff7043),.3,.25,.1).scale.set(1.5,.8,.8);
  return S};
