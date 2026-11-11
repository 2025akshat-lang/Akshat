
DIA.root={spots:[['root-cross','Dicot root'],['root-mono','Monocot root'],['root-tip','Root tip'],['root-hair','Root hair']],svg:`<svg viewBox="0 0 360 440">
<rect class="soil" x="0" y="60" width="360" height="380" opacity=".55"/><path class="soilline" d="M0 60H360"/>
<text class="ann" x="10" y="80">SOIL</text><path class="stemp" stroke-width="9" d="M180 8L180 62"/>
<path class="rootp" stroke-width="10" d="M180 60C176 160 184 280 178 392"/>
<path class="rootp" stroke-width="4" d="M180 130C150 140 124 160 100 200M179 200C150 214 126 246 112 290M178 270C148 288 134 318 128 350M180 110C210 122 236 140 262 176M181 190C212 204 238 228 254 270M180 260C210 278 228 300 238 340"/>
${hairs}
<ellipse cx="178" cy="402" rx="9" ry="13" fill="var(--root)" opacity=".6"/>
<path class="cut" d="M150 180H210"/>
${spot('root-cross',180,180,'Dicot root',206,164)}
${spot('root-hair',192,352,'Root hair',212,376)}
${ann(176,96,112,92,'Taproot','end')}${ann(250,168,350,126,'Lateral root','end')}${ann(184,408,236,424,'Root cap')}
<path class="rootp" stroke-width="2" d="M44 296V330M44 330C34 352 26 380 20 420M44 330C44 360 46 392 46 424M44 330C56 352 66 380 74 420"/>
${spot('root-mono',44,376,'Monocot root',44,436,'middle')}${spot('root-tip',178,396,'Root tip',140,430,'end')}
</svg>`};
