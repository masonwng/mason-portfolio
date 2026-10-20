// Hand-authored starter builds and matchup adjustments. No win-rate or live API claims.
const profiles={
 Garen:{starter:'1054',core:['6631','3046','3053'],style:'fighter'},Darius:{starter:'1054',core:['6631','3053','6333'],style:'fighter'},
 Sett:{starter:'1054',core:['6631','3053','3071'],style:'fighter'},Fiora:{starter:'1055',core:['3078','3053','6333'],style:'fighter'},
 Irelia:{starter:'1055',core:['3153','3078','3053'],style:'fighter'},Jax:{starter:'1054',core:['3078','3053','3157'],style:'fighter'},
 Yasuo:{starter:'1055',core:['3153','3031','3053'],style:'crit'},Yone:{starter:'1055',core:['3153','3031','3053'],style:'crit'},
 Ahri:{starter:'1056',core:['6655','3157','3089'],style:'mage'},Lux:{starter:'1056',core:['6655','3089','3135'],style:'mage'},
 Syndra:{starter:'1056',core:['6655','3089','3135'],style:'mage'},Veigar:{starter:'1056',core:['6655','3089','3157'],style:'mage'},
 Brand:{starter:'1056',core:['3116','3089','3135'],style:'mage'},Teemo:{starter:'1056',core:['3116','3089','3135'],style:'mage'},
 Zed:{starter:'1055',core:['6692','3142','3814'],style:'assassin'},Talon:{starter:'1055',core:['3142','6692','3814'],style:'assassin'},
 Jinx:{starter:'1055',core:['6672','3031','3085'],style:'marksman'},Caitlyn:{starter:'1055',core:['3031','3046','3036'],style:'marksman'},
 Ashe:{starter:'1055',core:['6672','3085','3031'],style:'marksman'},Kaisa:{starter:'1055',core:['6672','3153','3157'],style:'marksman'},
 Malphite:{starter:'1054',core:['3075','3110','3083'],style:'tank'},Ornn:{starter:'1054',core:['3075','2504','3083'],style:'tank'},
 Leona:{starter:'1054',core:['3190','3109','3075'],style:'support-tank'},Nautilus:{starter:'1054',core:['3190','3109','3075'],style:'support-tank'},
 Soraka:{starter:'1056',core:['6617','6620','3107'],style:'enchanter'},Lulu:{starter:'1056',core:['6617','3504','3107'],style:'enchanter'},
 Nami:{starter:'1056',core:['6620','6617','3504'],style:'enchanter'},Karma:{starter:'1056',core:['6620','6617','3107'],style:'enchanter'},
 Warwick:{starter:'1054',core:['3153','3053','3065'],style:'fighter'},Amumu:{starter:'1054',core:['3075','2504','3083'],style:'tank'},
};
const healing=new Set(['Aatrox','Darius','DrMundo','Fiora','Illaoi','Irelia','Mundo','Nasus','Renekton','Soraka','Swain','Sylas','Vladimir','Warwick','Yone','Yuumi','Zac']);
const control=new Set(['Ahri','Amumu','Ashe','Leona','Lissandra','Lux','Morgana','Nautilus','Neeko','Sejuani','Veigar']);
const pairs={
 'Garen:Darius':'Keep trades short and save Q to break his slow. Take armor early if his autos and bleed are forcing you out.',
 'Darius:Garen':'Look for extended trades after his Q. Don’t spend everything into his defensive window.',
 'Ahri:Zed':'Respect his level-six all-in. An early defensive component or Zhonya’s can be more useful than rushing damage.',
 'Zed:Ahri':'Watch for Charm before committing. Spell shield can help later, but it does not replace tracking her cooldown.',
 'Malphite:Jax':'Armor has value into his repeated attacks. Avoid spending your burst into Counter Strike.',
 'Jax:Malphite':'This lane can punish repeated autos. Look for short windows and consider sustain before a damage-heavy rush.',
 'Caitlyn:Jinx':'Use range to control the wave, but keep vision before pushing. Core damage is usually more useful than forcing a defensive first item.',
 'Soraka:Leona':'Stay out of engage range and avoid stacking with your ADC. Defensive positioning matters more than a greedy item rush.',
};
function defaultProfile(champion,role){const tags=champion.tags;if(role==='Support'){return tags.includes('Tank')?{starter:'1054',core:['3190','3109','3075'],style:'support-tank'}:{starter:'1056',core:['6620','6617','3107'],style:'enchanter'};}if(tags.includes('Marksman'))return {starter:'1055',core:['6672','3031','3036'],style:'marksman'};if(tags.includes('Mage'))return {starter:'1056',core:['6655','3089','3135'],style:'mage'};if(tags.includes('Tank'))return {starter:'1054',core:['3075','2504','3083'],style:'tank'};if(tags.includes('Assassin'))return {starter:'1055',core:['6692','3142','3814'],style:'assassin'};return {starter:'1054',core:['3078','3053','3071'],style:'fighter'};}
export function damageEstimate(champion){if(champion.info.magic>=champion.info.attack+3)return 'magic';if(champion.info.attack>=champion.info.magic+3)return 'physical';return 'mixed';}
export function recommend(champion,opponent,role,damage='auto',pressure='auto'){
 if(!champion||!opponent)return null;
 const profile=role==='Support'?defaultProfile(champion,role):(profiles[champion.id]||defaultProfile(champion,role));const type=damage==='auto'?damageEstimate(opponent):damage;
 const hasHeal=pressure==='healing'||(pressure==='auto'&&healing.has(opponent.id));const hasCC=pressure==='cc'||(pressure==='auto'&&control.has(opponent.id));
 const boots=hasCC||type==='magic'?'3111':type==='physical'?'3047':profile.style==='mage'?'3020':profile.style==='marksman'||profile.style==='crit'?'3006':'3158';
 const adjustments=[];
 adjustments.push({id:boots,why:boots==='3111'?'Magic resist and tenacity can help against magic pressure or reducible crowd control. Tenacity does not shorten knockups.':boots==='3047'?'Consider armor boots against attack pressure. They do not reduce every source of physical damage.':'A baseline boot option for this champion’s class. Swap based on the whole enemy team.'});
 if(hasHeal)adjustments.push({id:profile.style.includes('tank')?'3076':['mage','enchanter'].includes(profile.style)?'3916':'3123',why:'Consider an early anti-heal component if healing is deciding trades. Check how your item applies Grievous Wounds before buying.'});
 if(type==='magic'&&['fighter','tank','support-tank'].includes(profile.style))adjustments.push({id:'2504',why:'A magic-resist option if the lane and enemy team have enough magic damage to justify it.'});
 if(type==='physical'&&['mage','enchanter'].includes(profile.style))adjustments.push({id:'3157',why:'An armor and stasis option against physical all-ins. Only buy it if the defensive tradeoff fits your champion.'});
 if(type==='physical'&&['fighter','tank','support-tank'].includes(profile.style))adjustments.push({id:champion.resource==='Mana'?'3110':'6333',why:champion.resource==='Mana'?'An armor option against sustained attack pressure; the mana can also support longer lanes.':'An armor and damage option for physical pressure that avoids paying for unused mana.'});
 return {core:profile.core,starter:profile.starter,style:profile.style,damage:type,curated:!!profiles[champion.id],adjustments,note:pairs[`${champion.id}:${opponent.id}`]||`Use the ${type} pressure estimate as a starting point, then adjust for the enemy team and who is ahead. These are class-based suggestions, not matchup win-rate data.`,roleNote:role==='Jungle'?'Jungle: buy the jungle companion that fits your plan first; these are later item ideas.':role==='Support'?'Support: start World Atlas and prioritize your support quest; these are later item ideas.':null};
}
