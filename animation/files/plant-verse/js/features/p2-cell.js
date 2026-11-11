
SC['plant-cell']=()=>{
  const S=new Sc(),L=PV.L,W=4.2,H=2.7,D=2,add=(id,g,m,x,y,z)=>S.add(id,mesh(g,m,x,y,z)),
    pt=(id,en,hi,de,dh,a)=>S.part(id,L(en,hi),L(de,dh),a);
  S.title=L('Plant cell: cut-open 3D view','पादप कोशिका: कटा हुआ 3D दृश्य');S.cam=7.6;S.group.rotation.set(.2,-.3,0);
  S.note=L('Simplified generic cell. Not every plant cell looks like this: a mature xylem vessel, for example, has lost its nucleus and most organelles.','सरल सामान्य कोशिका। हर पादप कोशिका ऐसी नहीं होती: जैसे परिपक्व जाइलम वाहिका में केंद्रक और अधिकांश अंगक नहीं रहते।');
  pt('wall','Cell wall','कोशिका भित्ति','Rigid outer layer made mainly of cellulose. Gives shape and support; found in plant cells, not animal cells.','मुख्यतः सेलुलोज़ की बनी कठोर बाहरी परत। आकार और सहारा देती है; पादप कोशिका में होती है, जंतु कोशिका में नहीं।',[-2.05,.8,0]);
  pt('membrane','Plasma membrane','कोशिका झिल्ली','Thin layer just inside the wall. It decides what enters and leaves the cell (selectively permeable).','भित्ति के ठीक भीतर पतली परत। तय करती है कि क्या भीतर आए और बाहर जाए (वरणात्मक पारगम्य)।',[1.9,-.8,.3]);
  pt('cyto','Cytoplasm','कोशिकाद्रव्य','Jelly-like fluid that fills the cell around the organelles. Many chemical reactions happen here.','अंगकों के चारों ओर भरा जेली-जैसा द्रव। यहाँ कई रासायनिक अभिक्रियाएँ होती हैं।',[.9,-.95,-.78]);
  pt('nuc','Nucleus','केंद्रक','Enclosed by a double envelope with pores. Holds the DNA (as chromatin) and controls cell activities.','दोहरे आवरण (छिद्रों सहित) से घिरा। इसमें DNA (क्रोमैटिन रूप में) होता है और कोशिका की क्रियाओं को नियंत्रित करता है।');
  pt('nucleolus','Nucleolus','केंद्रिका','Dense spot inside the nucleus where parts of ribosomes are made.','केंद्रक के भीतर सघन बिंदु जहाँ राइबोसोम के भाग बनते हैं।');
  pt('vac','Central vacuole','केंद्रीय रिक्तिका','Large sac of cell sap, bounded by its own membrane (tonoplast). Stores water and substances, keeps the cell firm, and pushes other organelles to the edge.','कोशिका रस से भरी बड़ी थैली, जिसकी अपनी झिल्ली (टोनोप्लास्ट) होती है। पानी व पदार्थ जमा करती है, कोशिका को कड़ा रखती है और अन्य अंगकों को किनारे धकेलती है।');
  pt('chloro','Chloroplasts','हरितलवक','Green organelles with chlorophyll; the site of photosynthesis. Tap “Chloroplast” below to look inside.','क्लोरोफिल वाले हरे अंगक; प्रकाश-संश्लेषण का स्थान। भीतर देखने के लिए नीचे “हरितलवक” दबाएँ।');
  pt('mito','Mitochondria','माइटोकॉन्ड्रिया','Release energy from food by respiration (make ATP). They have their own DNA.','श्वसन द्वारा भोजन से ऊर्जा (ATP) मुक्त करते हैं। इनका अपना DNA होता है।');
  pt('er','Endoplasmic reticulum','अंतर्द्रव्यी जालिका','Network of membranes joined to the nuclear envelope. Rough ER (with ribosomes) makes proteins; smooth ER makes lipids.','केंद्रक आवरण से जुड़ा झिल्लियों का जाल। खुरदरी ER (राइबोसोम सहित) प्रोटीन और चिकनी ER लिपिड बनाती है।');
  pt('ribo','Ribosomes','राइबोसोम','Tiny granules that build proteins. Free in the cytoplasm or attached to rough ER.','प्रोटीन बनाने वाले सूक्ष्म कण। कोशिकाद्रव्य में मुक्त या खुरदरी ER से जुड़े होते हैं।');
  pt('golgi','Golgi apparatus','गॉल्जी उपकरण','Stack of flattened sacs that modifies, packs and sends out proteins and lipids. In plants it also makes cell-wall materials.','चपटी थैलियों का ढेर जो प्रोटीन व लिपिड को संशोधित, पैक और भेजता है। पादपों में भित्ति के पदार्थ भी बनाता है।');
  pt('pd','Plasmodesmata','प्लाज़्मोडेस्माटा','Narrow channels through the cell wall that connect the cytoplasm of neighbouring cells.','कोशिका भित्ति के आर-पार संकरी नलिकाएँ जो पड़ोसी कोशिकाओं के कोशिकाद्रव्य को जोड़ती हैं।');
  
  const box5=(id,i,t,m)=>{const w=W-2*i,h=H-2*i,dz=D-i,zc=i/2,ox=W/2-i-t/2,oy=H/2-i-t/2;
    add(id,new T.BoxGeometry(w,h,t),m,0,0,-D/2+i+t/2);
    [-1,1].forEach(s=>{add(id,new T.BoxGeometry(t,h,dz),m,s*ox,0,zc);add(id,new T.BoxGeometry(w,t,dz),m,0,s*oy,zc)})};
  box5('wall',0,.14,M(0x9ccc65));box5('membrane',.14,.03,M(0xffb74d));
  add('cyto',new T.BoxGeometry(W-.36,H-.36,.02),M(0xdcedc8,{transparent:true,opacity:.7}),0,0,-D/2+.2);
  add('vac',new T.SphereGeometry(1,32,20),M(0x81d4fa,{transparent:true,opacity:.5}),.1,0,-.2).scale.set(1.35,.85,.5);
  add('nuc',new T.SphereGeometry(.42,24,16),M(0xb39ddb,{transparent:true,opacity:.45}),-1.4,.62,.35);
  add('nucleolus',new T.SphereGeometry(.15,16,12),M(0x4a148c),-1.35,.62,.35);
  [[-.9,-.95,.4],[.6,.98,.35],[1.55,.5,.45],[1.5,-.5,.5],[-1.6,-.5,.45]].forEach(p=>add('chloro',new T.SphereGeometry(.2,16,12),M(0x43a047),p[0],p[1],p[2]).scale.set(1.5,.8,.8));
  [[-.95,-.1,.55],[.9,-1,.45],[1.1,.95,.5]].forEach(p=>add('mito',new T.SphereGeometry(.12,14,10),M(0xef6c00),p[0],p[1],p[2]).scale.set(1.8,.8,.8));
  const V=a=>a.map(p=>new T.Vector3(p[0],p[1],p[2])),erM=M(0x9575cd),dk=M(0x212121),
    cs=[new T.CatmullRomCurve3(V([[-1,.95,.3],[-.8,.65,.45],[-.9,.3,.4],[-1.1,.05,.45],[-1.35,-.1,.35]])),
        new T.CatmullRomCurve3(V([[-1.8,.9,.35],[-1.7,.5,.5],[-1.85,.1,.4],[-1.7,-.3,.5],[-1.5,-.6,.4]]))];
  cs.forEach(c=>{add('er',new T.TubeGeometry(c,24,.04,6),erM);for(let i=0;i<=6;i++){const p=c.getPoint(i/6);add('ribo',new T.SphereGeometry(.035,8,6),dk,p.x+.04,p.y+.04,p.z+.04)}});
  const gg=new T.Group();gg.position.set(1,-.55,.55);gg.rotation.set(.9,0,-.3);S.group.add(gg);
  for(let i=0;i<4;i++)S.add('golgi',mesh(new T.CylinderGeometry(.24-.02*i,.24-.02*i,.035,24),M(0xffd54f),0,i*.075,0),gg);
  [.5,.1,-.3].forEach(y=>add('pd',new T.CylinderGeometry(.05,.05,.3,10).rotateZ(Math.PI/2),M(0x263238),W/2-.07,y,0));
  return S};
DIA.leaf.spots.push(['plant-cell','Plant cell']);SCENE_PART['plant-cell']='leaf';
