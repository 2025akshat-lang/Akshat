

const L1=`<svg viewBox="0 0 360 520" preserveAspectRatio="xMidYMid meet" role="group" aria-label="Whole plant">
<rect class="soil" x="0" y="318" width="360" height="202" opacity=".55"/><path class="soilline" d="M0 318H360"/>

<g class="part" data-part="root" tabindex="0" role="button" aria-label="Roots"><rect class="hit" x="80" y="320" width="200" height="170"/>
<path class="rootp" stroke-width="7" d="M180 318C176 360 184 410 178 474"/>
<path class="rootp" stroke-width="3.5" d="M180 346C152 354 130 374 112 410M180 376C210 386 232 400 248 436M179 410C158 420 146 440 140 466M180 334C204 340 226 352 246 350"/>
</g>
<g class="part" data-part="stem" tabindex="0" role="button" aria-label="Stem"><rect class="hit" x="160" y="120" width="40" height="198"/>
<path class="stemp" stroke-width="9" d="M180 318C184 260 176 190 180 112"/>
</g>
<g class="part" data-part="leaf" tabindex="0" role="button" aria-label="Leaf"><rect class="hit" x="70" y="120" width="220" height="116"/>
<path class="leafp" d="M180 226C160 192 124 174 84 172C100 204 138 226 180 226Z"/><path class="vein" d="M180 226Q130 200 90 176"/>
<path class="leafp" d="M180 176C204 148 238 130 276 128C262 162 224 184 180 176Z"/><path class="vein" d="M180 176Q230 150 270 130"/>
</g>
<g class="part" data-part="fruit" tabindex="0" role="button" aria-label="Fruit"><rect class="hit" x="190" y="248" width="110" height="64"/>
<path class="stemp" stroke-width="3.5" d="M181 262Q214 252 232 268"/>
<circle class="fruitp" cx="240" cy="284" r="21"/><path d="M228 266l12 6 12-6-6 10h-12z" fill="var(--leaf2)"/>
</g>
<g class="part" data-part="flower" tabindex="0" role="button" aria-label="Flower"><circle class="hit" cx="180" cy="92" r="52"/>
${[0,72,144,216,288].map(a=>`<ellipse class="petalp" cx="180" cy="68" rx="14" ry="27" transform="rotate(${a} 180 96)"/>`).join('')}
<circle class="pollen" cx="180" cy="96" r="12"/>
</g>
</svg>`;
