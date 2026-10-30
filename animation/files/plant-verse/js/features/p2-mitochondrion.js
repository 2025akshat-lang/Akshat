
SC['mitochondrion']=()=>{
  const S=new Sc(),L=PV.L,add=(id,g,m,x,y,z)=>S.add(id,mesh(g,m,x,y,z)),pt=(id,en,hi,de,dh)=>S.part(id,L(en,hi),L(de,dh));
  S.title=L('Mitochondrion: the cell’s power house','माइटोकॉन्ड्रिया: कोशिका का ऊर्जा-घर');S.cam=6;S.group.rotation.set(.3,.5,0);
  S.note=L('Simplified: in living cells mitochondria change shape and can form networks.','सरलीकृत: जीवित कोशिकाओं में माइटोकॉन्ड्रिया का आकार बदलता रहता है और वे जाल भी बना सकते हैं।');
  pt('outer','Outer membrane','बाह्य झिल्ली','Smooth outer boundary of the mitochondrion.','माइटोकॉन्ड्रिया की चिकनी बाहरी सीमा।');
  pt('ims','Intermembrane space','अंतरा-झिल्ली स्थान','Narrow gap between the two membranes.','दोनों झिल्लियों के बीच संकरा स्थान।');
  pt('inner','Inner membrane','आंतरिक झिल्ली','Folded inner membrane; ATP is made on it.','मुड़ी हुई आंतरिक झिल्ली; इस पर ATP बनता है।');
  pt('cristae','Cristae','क्रिस्टी','Folds of the inner membrane. They increase the surface area for making ATP.','आंतरिक झिल्ली की तहें। ATP बनाने के लिए सतह क्षेत्र बढ़ाती हैं।');
  pt('matrix','Matrix','आधात्री (मैट्रिक्स)','Fluid inside the inner membrane. Many steps of respiration (Krebs cycle) happen here.','आंतरिक झिल्ली के भीतर का द्रव। श्वसन के कई चरण (क्रेब्स चक्र) यहाँ होते हैं।');
  pt('mdna','Mitochondrial DNA','माइटोकॉन्ड्रियल DNA','Small circular DNA. Mitochondria make some of their own proteins.','छोटा गोलाकार DNA। माइटोकॉन्ड्रिया अपने कुछ प्रोटीन खुद बनाते हैं।');
  const G=new T.Group();G.scale.set(1.7,.7,.7);S.group.add(G);
  [['outer',1,0xff7043,.35],['ims',.95,0xffccbc,.3],['inner',.9,0xe64a19,.4],['matrix',.82,0xffcc80,.35]].forEach(a=>cutSphere(S,a[0],a[1],M(a[2],{transparent:true,opacity:a[3]}),G));
  for(let i=0;i<6;i++)add('cristae',new T.BoxGeometry(.04,.55,.5),M(0xd84315),-.9+i*.36,i%2?.12:-.12,0);
  add('mdna',new T.TorusGeometry(.1,.012,8,20),M(0xfdd835),.3,-.05,.15);
  return S};
SCENE_PART['mitochondrion']='leaf';
