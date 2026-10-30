
registerLesson({
  id:'newton2',
  title:'Newton ka dusra niyam (F = ma)',
  steps:[
    {k:'title', t:'Force, Mass and Acceleration', h:'बल, द्रव्यमान और त्वरण'},
    {k:'note',  t:'Force is fixed', h:'बल स्थिर रखा गया'},
    {k:'note',  t:'Car mass is doubled', h:'चलने वाली गाड़ी का द्रव्यमान दुगुना'},
    {k:'note',  t:'Paper cup mass is fixed', h:'कागज़ के कप का द्रव्यमान स्थिर'},
    {k:'svg', t:'Same force, heavier car: slower', h:'वही बल, भारी गाड़ी: धीमी',
     svg:'<svg viewBox="0 0 320 110" width="320" role="img" aria-label="Force pushes a car"><rect x="110" y="30" width="110" height="40" rx="8" fill="#1e5fd8"/><circle cx="135" cy="78" r="14" fill="#222"/><circle cx="195" cy="78" r="14" fill="#222"/><path d="M20 50h70" stroke="#c4001d" stroke-width="8"/><path d="M90 34l24 16-24 16z" fill="#c4001d"/><text x="22" y="30" font-size="18" font-family="sans-serif" fill="#222">Force</text></svg>'},
    {k:'note',  t:'Set-up A moves slowly: slow acceleration', c:'red', h:'सेट-अप A धीमी गति से चलता है'},
    {k:'note',  t:'Set-up B moves fast: fast acceleration', c:'green', h:'सेट-अप B तेज़ गति से चलता है'},
    {k:'def',   t:'Conclusion', h:'निष्कर्ष'},
    {k:'eq',    t:'mass (m) ∝ 1 / acceleration (a)'},
    {k:'eq',    t:'force (F) ∝ acceleration (a)'},
    {k:'eq',    t:'a ∝ F / m'},
    {k:'ans',   t:'a = F / m   or   F = m × a', h:'Newton ka dusra niyam'},
    {k:'obj',   svg:'<svg viewBox="0 0 160 70"><rect x="10" y="20" width="140" height="30" rx="8" fill="#1e5fd8"/><rect x="40" y="6" width="70" height="22" rx="8" fill="#6fb1ff"/><circle cx="42" cy="54" r="13" fill="#222"/><circle cx="118" cy="54" r="13" fill="#222"/></svg>', w:.4, x:.3, y:.62, anim:'slide'},
    {k:'q',     t:'Heavier mass, same force: what happens?'},
    {k:'ans',   t:'Larger mass gives smaller acceleration', h:'ज़्यादा द्रव्यमान, कम त्वरण'}
  ]
});
