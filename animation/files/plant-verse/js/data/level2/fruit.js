
DIA.fruit={spots:[['fruit-cross','Fruit section'],['seed','Seed']],svg:`<svg viewBox="0 0 360 440">
<path class="stemp" stroke-width="7" d="M180 112Q184 84 204 68"/>
<circle class="fruitp" cx="180" cy="250" r="132"/>
<circle class="fleshp" cx="180" cy="250" r="118"/>
<ellipse class="corep" cx="180" cy="254" rx="40" ry="58"/>
${[[166,226,-20],[196,226,20],[160,262,-10],[200,262,10],[180,286,0],[180,238,0]].map(s=>`<ellipse class="seedp" cx="${s[0]}" cy="${s[1]}" rx="6" ry="10" transform="rotate(${s[2]} ${s[0]} ${s[1]})"/>`).join('')}
<path d="M164 122l16 14 16-14-6 20h-20z" fill="var(--leaf2)"/>
${spot('fruit-cross',104,236,'Fruit section',104,282,'middle')}
${spot('seed',180,262,'Seed',232,306)}
${ann(268,152,312,120,'Skin')}${ann(262,222,322,214,'Flesh')}${ann(200,76,250,58,'Pedicel')}
</svg>`};
