

const FULL={seed:0,root:1,shoot:1,l1:1,l2:1,flower:1,bloom:1,fruit:1,ripe:1,bee:0,drop:0,seedsOut:0,sprout:0};
const DEF0={seed:0,root:0,shoot:0,l1:0,l2:0,flower:0,bloom:0,fruit:0,ripe:0,bee:0,drop:0,seedsOut:0,sprout:0};
const ADULT={root:1,shoot:1,l1:1,l2:1,flower:1,bloom:1};
const STAGES={
  life:[['Seed',{seed:1}],
    ['Germination',{seed:.75,root:.14,shoot:.05}],
    ['Seedling',{seed:.4,root:.3,shoot:.24,l1:.7}],
    ['Growth',{root:.65,shoot:.62,l1:.9,l2:.55}],
    ['Flowering',{root:.9,shoot:1,l1:1,l2:1,flower:1,bloom:1}],
    ['Fruiting',{root:1,shoot:1,l1:1,l2:1,flower:1,bloom:1,fruit:1,ripe:1}]],
  repro:[['Pollination',Object.assign({},ADULT,{bee:1})],
    ['Fertilisation',Object.assign({},ADULT,{bloom:.55,fruit:.3})],
    ['Fruit',Object.assign({},ADULT,{bloom:.3,fruit:1,ripe:1})],
    ['Dispersal',Object.assign({},ADULT,{bloom:.3,fruit:1,ripe:1,drop:1,seedsOut:1})],
    ['New plant',Object.assign({},ADULT,{bloom:.3,fruit:1,ripe:1,drop:1,seedsOut:1,sprout:1})]]
};
