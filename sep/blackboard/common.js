
registerWords({
  words:['the','and','because','receive','separate','definitely','which','their','there'],
  fixes:{'teh':'the','recieve':'receive','seperate':'separate','definately':'definitely','becuase':'because','wich':'which','thier':'their'},
  rules:[['\\bi am\\b(?=\\s+go)','I am']]
});
