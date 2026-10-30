
SC['chloroplast']=()=>{
  const S=new Sc(),L=PV.L,add=(id,g,m,x,y,z,par)=>S.add(id,mesh(g,m,x,y,z),par),pt=(id,en,hi,de,dh)=>S.part(id,L(en,hi),L(de,dh));
  S.title=L('Chloroplast: inside the solar panel','हरितलवक: भीतर की संरचना');S.cam=6.2;S.group.rotation.set(.3,.5,0);
  S.note=L('Simplified: real chloroplasts vary in shape and number of grana.','सरलीकृत: असली हरितलवकों का आकार और ग्रेना की संख्या अलग-अलग होती है।');
  pt('outer','Outer membrane','बाह्य झिल्ली','Smooth outer boundary of the chloroplast; freely lets small molecules pass.','हरितलवक की चिकनी बाहरी सीमा; छोटे अणुओं को आसानी से जाने देती है।');
  pt('ims','Intermembrane space','अंतरा-झिल्ली स्थान','Narrow gap between the outer and inner membranes.','बाह्य और आंतरिक झिल्ली के बीच संकरा स्थान।');
  pt('inner','Inner membrane','आंतरिक झिल्ली','Controls which substances enter or leave the stroma.','तय करती है कि कौन-से पदार्थ स्ट्रोमा में आएँ या जाएँ।');
  pt('stroma','Stroma','स्ट्रोमा','Fluid inside the inner membrane. Carbon fixation (Calvin cycle) happens here, making sugars.','आंतरिक झिल्ली के भीतर का द्रव। यहाँ कार्बन स्थिरीकरण (केल्विन चक्र) होता है और शर्करा बनती है।');
  pt('grana','Thylakoids and grana','थाइलेकॉइड व ग्रेना','Flattened sacs (thylakoids) stacked into grana. Their membranes hold chlorophyll and carry out the light reactions.','चपटी थैलियाँ (थाइलेकॉइड) जो ढेर बनाकर ग्रेना बनाती हैं। इनकी झिल्लियों में क्लोरोफिल होता है और प्रकाश अभिक्रियाएँ होती हैं।');
  pt('lamellae','Stroma lamellae','स्ट्रोमा लैमेली','Thin membrane plates that connect one granum to another.','पतली झिल्ली-पट्टियाँ जो एक ग्रेनम को दूसरे से जोड़ती हैं।');
  pt('dna','Chloroplast DNA','हरितलवक DNA','Small circular DNA. Chloroplasts make some of their own proteins.','छोटा गोलाकार DNA। हरितलवक अपने कुछ प्रोटीन खुद बनाते हैं।');
  pt('ribo','Ribosomes','राइबोसोम','Tiny protein-making granules in the stroma.','स्ट्रोमा में प्रोटीन बनाने वाले सूक्ष्म कण।');
  pt('starch','Starch grain','स्टार्च कण','Temporary store of the sugar made in photosynthesis.','प्रकाश-संश्लेषण में बनी शर्करा का अस्थायी भंडार।');
  const G=new T.Group();G.scale.set(1.7,.95,.95);S.group.add(G);
  [['outer',1,0x66bb6a,.35],['ims',.96,0xc8e6c9,.3],['inner',.92,0x2e7d32,.35],['stroma',.88,0xa5d6a7,.3]].forEach(a=>cutSphere(S,a[0],a[1],M(a[2],{transparent:true,opacity:a[3]}),G));
  const gp=[[-.95,.15,.1],[-.2,-.2,.2],[.5,.25,-.1],[1,-.1,.15]];
  gp.forEach(p=>{for(let i=0;i<6;i++)add('grana',new T.CylinderGeometry(.2,.2,.04,20),M(0x1b5e20),p[0],p[1]-.14+i*.056,p[2])});
  for(let i=0;i<3;i++){const a=gp[i],b=gp[i+1],dx=b[0]-a[0],dy=b[1]-a[1];
    add('lamellae',new T.BoxGeometry(Math.hypot(dx,dy),.02,.12),M(0x66bb6a),(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2).rotation.z=Math.atan2(dy,dx)}
  add('dna',new T.TorusGeometry(.12,.015,8,24),M(0xfdd835),0,.5,.3);
  for(let i=0;i<12;i++)add('ribo',new T.SphereGeometry(.03,8,6),M(0x212121),(rnd()-.5)*2,(rnd()-.5)*.8,(rnd()-.5)*.8);
  add('starch',new T.SphereGeometry(.13,12,10),M(0xfffde7),.15,-.5,.1);
  return S};
SCENE_PART['chloroplast']='leaf';
