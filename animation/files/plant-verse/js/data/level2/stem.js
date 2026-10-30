
DIA.stem={spots:[['stem-dicot','Dicot stem'],['stem-mono','Monocot stem'],['stem-wood','Tree trunk'],['bud-apical','Buds']],svg:`<svg viewBox="0 0 360 440">
<path class="stemp" stroke-width="16" d="M180 424L180 56"/>
<path class="stemp" stroke-width="22" d="M180 330h0M180 200h0M180 82h0" opacity=".55"/>
<path class="leafp" d="M172 330C150 316 120 316 96 300C120 292 156 304 172 330Z"/>
<path class="leafp" d="M188 200C210 186 240 186 264 170C240 162 204 174 188 200Z"/>
<path class="leafp" d="M172 82C150 68 120 68 96 52C120 44 156 56 172 82Z"/>
<ellipse cx="195" cy="322" rx="5" ry="9" fill="var(--pollen)"/><ellipse cx="180" cy="42" rx="7" ry="15" fill="var(--pollen)"/>
<ellipse class="cut" cx="180" cy="142" rx="22" ry="7"/>
${spot('stem-dicot',180,142,'Dicot section',146,132,'end')}
<g fill="none" stroke="var(--root)" stroke-width="2">${[40,32,24,16,8].map(r=>`<circle cx="276" cy="360" r="${r}"/>`).join('')}</g>
${spot('stem-wood',276,360,'Trunk rings',276,416,'middle')}
${ann(188,42,244,30,'Terminal bud')}${ann(188,206,252,236,'Node')}${ann(172,270,112,276,'Internode','end')}${ann(200,318,262,296,'Axillary bud')}
<rect x="44" y="290" width="12" height="130" rx="4" fill="var(--stem)"/><path d="M40 330h20M40 370h20" stroke="var(--leaf2)" stroke-width="3"/>
<path class="leafp" d="M56 330C84 322 108 322 124 304C104 336 80 342 56 340Z"/>
${spot('stem-mono',50,380,'Monocot stem',50,434,'middle')}${spot('bud-apical',180,48,'Buds',120,24,'end')}
</svg>`};
