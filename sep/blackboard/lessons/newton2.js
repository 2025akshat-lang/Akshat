/* k = title | eq | note | def | q | ans   c = cyan | red | yellow | green   h = Hindi line   x^2 = power, m_1 = subscript */
registerLesson({
  id:'newton2',
  title:'Newton ka dusra niyam (F = ma)',
  steps:[
    {k:'title', t:'Force, Mass and Acceleration', h:'बल, द्रव्यमान और त्वरण'},
    {k:'note',  t:'Force is fixed', h:'बल स्थिर रखा गया'},
    {k:'note',  t:'Car mass is doubled', h:'चलने वाली गाड़ी का द्रव्यमान दुगुना'},
    {k:'note',  t:'Paper cup mass is fixed', h:'कागज़ के कप का द्रव्यमान स्थिर'},
    {k:'note',  t:'Set-up A moves slowly: slow acceleration', c:'red', h:'सेट-अप A धीमी गति से चलता है'},
    {k:'note',  t:'Set-up B moves fast: fast acceleration', c:'green', h:'सेट-अप B तेज़ गति से चलता है'},
    {k:'def',   t:'Conclusion', h:'निष्कर्ष'},
    {k:'eq',    t:'mass (m) ∝ 1 / acceleration (a)'},
    {k:'eq',    t:'force (F) ∝ acceleration (a)'},
    {k:'eq',    t:'a ∝ F / m'},
    {k:'ans',   t:'a = F / m   or   F = m × a', h:'Newton ka dusra niyam'},
    {k:'q',     t:'Heavier mass, same force: what happens?'},
    {k:'ans',   t:'Larger mass gives smaller acceleration', h:'ज़्यादा द्रव्यमान, कम त्वरण'}
  ]
});
