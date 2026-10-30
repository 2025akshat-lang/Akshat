
registerLesson({
  id:'temperature',
  title:'Temperature scale and measurement',
  steps:[
    {k:'section', t:'Questions and answers'},
    {k:'title', t:'Temperature Scales'},
    {k:'note',  t:'Normal human body temperature'},
    {k:'eq',    t:'37 °C = 98.6 °F = 310.15 K'},
    {k:'q',     t:'Do the readings 37 °C / 98.6 °F / 310.15 K always give a reliable measure? Does body temperature really vary?'},
    {k:'ans',   t:'Ideal body temperature is 37 °C, but the real temperature varies from 36 °C to 42 °C.'},
    {k:'note',  t:'(i) A thermometer placed at the armpit reads about 0.5 to 1 °C lower than in the mouth.'},
    {k:'note',  t:'(ii) It varies with age, time, day and previous activity level.'},
    {k:'section', t:'Blackboard work summary (concept map)'},
    {k:'map', carrier:'monkey', tree:{t:'Temperature Measurement', kids:[
      {t:'Method', kids:[
        {t:'Ancient Method', kids:[{t:'Pulse Rate', kids:[{t:'Non-reliable scientific method'}]}]},
        {t:'Modern scale method', kids:[{t:'Same thermometer', kids:[
          {t:'Degree Fahrenheit', kids:[{t:'Represented by °F'},{t:'Medical uses (fever)'}]},
          {t:'Kelvin', kids:[{t:'Represented by K'},{t:'Scientific discoveries'}]},
          {t:'Degree Celsius', kids:[{t:'Daily weather'}]},
          {t:'Conversion formula', kids:[{t:'°C to °F:\n°F = (°C × 9/5) + 32'},{t:'°C to K:\nK = °C + 273.15'}]}
        ]}]}
      ]}
    ]}}
  ]
});
