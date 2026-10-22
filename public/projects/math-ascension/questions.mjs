export const LEVELS = ['Kindergarten', ...Array.from({length:12},(_,i)=>`Grade ${i+1}`), 'University Year 1'];
export function seeded(seed){let n=seed>>>0;return()=>{n+=0x6D2B79F5;let t=n;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
const number=(topic,prompt,tex,answer,hint,steps)=>({topic,prompt,tex,answer:String(answer),hint,steps,type:'number'});
const expression=(topic,prompt,tex,answer,hint,steps)=>({...number(topic,prompt,tex,answer,hint,steps),type:'expression'});
function choice(topic,prompt,tex,answer,others,hint,steps,r){const options=[answer,...others].map((text,i)=>({id:String(i),text}));for(let i=options.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[options[i],options[j]]=[options[j],options[i]];}return {...number(topic,prompt,tex,'0',hint,steps),type:'choice',options,answerText:answer};}
// Each template constructs its answer and explanation from the same exact parameters.
// Topics are selected independently on every run; parameters vary within each template.
export const TEMPLATES = [
 [
  (n)=>{const a=n(2,6),b=n(1,3);return number('Counting','How many dots are there?',String.raw`\underbrace{${Array(a+b).fill('\\bullet').join('\\;')}}_{\text{count them}}`,a+b,'Count each dot once.',[`There are ${a+b} dots. Count from 1 to ${a+b}.`]);},
  (n)=>{const a=n(1,5),b=n(1,4);return number('Addition','Add the two numbers.',`${a}+${b}=?`,a+b,'Start at the first number and count forward.',[`Start at ${a}. Count forward ${b} more.`,`${a} + ${b} = ${a+b}.`]);},
  (n)=>{const a=n(2,8);return number('Number order','Which number comes next?',String.raw`${a-1},\;${a},\;?`,a+1,'Count one more.',[`After ${a} comes ${a+1}.`]);}
 ],
 [
  (n)=>{const a=n(5,12),b=n(2,8);return number('Addition','Find the sum.',`${a}+${b}`,a+b,'Make a ten if it helps.',[`Add ${b} to ${a}.`,`${a} + ${b} = ${a+b}.`]);},
  (n)=>{const a=n(10,20),b=n(2,9);return number('Subtraction','Find the difference.',`${a}-${b}`,a-b,'Count back from the first number.',[`Count back ${b} from ${a}.`,`${a} − ${b} = ${a-b}.`]);},
  (n)=>{const a=n(3,8),b=n(2,9);return number('Missing number','Find the missing number.',`?+${a}=${a+b}`,b,'Subtract the number you know from the total.',[`${a+b} − ${a} = ${b}.`]);}
 ],
 [
  (n)=>{const a=n(21,58),b=n(12,37);return number('Two-digit addition','Add.',`${a}+${b}`,a+b,'Add tens and ones, then combine.',[`Tens contribute ${Math.floor(a/10)*10+Math.floor(b/10)*10}; ones contribute ${a%10+b%10}.`,`The total is ${a+b}.`]);},
  (n)=>{const a=n(52,90),b=n(18,39);return number('Word problem',`You have ${a} stickers and give away ${b}. How many remain?`,'',a-b,'Subtract the number given away.',[`${a} − ${b} = ${a-b} stickers.`]);},
  (n)=>{const a=n(2,8),b=n(1,9);return number('Place value',`What number has ${a} tens and ${b} ones?`,'',10*a+b,'A ten is worth 10.',[`${a} × 10 + ${b} = ${10*a+b}.`]);}
 ],
 [
  (n)=>{const a=n(3,9),b=n(3,9);return number('Multiplication','Multiply.',String.raw`${a}\times${b}`,a*b,'Think of equal groups.',[`${a} groups of ${b} make ${a*b}.`]);},
  (n)=>{const a=n(3,9),b=n(3,9);return number('Division','Divide.',String.raw`${a*b}\div${b}`,a,'Use the matching multiplication fact.',[`${b} × ${a} = ${a*b}, so ${a*b} ÷ ${b} = ${a}.`]);},
  (n)=>{const a=n(3,7),b=n(3,8);return number('Equal groups',`There are ${a} bags with ${b} marbles each. How many marbles?`,'',a*b,'Multiply bags by marbles per bag.',[`${a} × ${b} = ${a*b} marbles.`]);}
 ],
 [
  (n)=>{const d=n(4,9),a=n(1,d-2);return number('Fractions','Add. A fraction or decimal is fine.',String.raw`\frac{${a}}{${d}}+\frac{1}{${d}}`,`${a+1}/${d}`,'Keep the denominator and add the numerators.',[`(${a} + 1)/${d} = ${a+1}/${d}.`]);},
  (n)=>{const a=n(12,29),b=n(3,8);return number('Multi-digit multiplication','Multiply.',String.raw`${a}\times${b}`,a*b,'Split the two-digit number into tens and ones.',[`(${Math.floor(a/10)*10} × ${b}) + (${a%10} × ${b}) = ${a*b}.`]);},
  (n)=>{const d=n(3,8),a=n(2,9);return number('Fraction of a quantity',`Find one ${d}th of ${d*a}.`,String.raw`\frac{1}{${d}}\times${d*a}`,a,'Divide the quantity by the denominator.',[`${d*a} ÷ ${d} = ${a}.`]);}
 ],
 [
  (n)=>{const a=n(12,59),b=n(11,29);return number('Decimals','Add.',`${a/10}+${b/10}`,`${a+b}/10`,'Align the decimal points.',[`${a} tenths + ${b} tenths = ${a+b} tenths.`,`The answer is ${(a+b)/10}.`]);},
  (n)=>{const a=n(2,12)*20;return number('Percentages',`What is 25% of ${a}?`,'',a/4,'25% is one quarter.',[`Divide ${a} by 4.`,`The answer is ${a/4}.`]);},
  (n)=>{const a=n(4,12),b=n(3,9);return number('Geometry',`A rectangle is ${a} cm long and ${b} cm wide. What is its area in cm²?`,'',a*b,'Area is length × width.',[`${a} × ${b} = ${a*b} cm².`]);}
 ],
 [
  (n)=>{const a=n(2,6),b=n(2,7),k=n(2,5);return number('Ratios',`Red : blue beads = ${a} : ${b}. If there are ${a*k} red beads, how many blue beads?`,'',b*k,'Scale both parts of the ratio equally.',[`${a*k} ÷ ${a} = ${k}.`,`Blue beads: ${b} × ${k} = ${b*k}.`]);},
  (n)=>{const a=n(4,15),b=n(2,12);return number('Negative numbers','Calculate.',`-${a}+${b}`,b-a,'Move right for addition on a number line.',[`Starting at −${a}, move ${b} places right to ${b-a}.`]);},
  (n)=>{const a=n(2,7),x=n(2,9);return number('Introductory algebra','Solve for x.',`${a}x=${a*x}`,x,'Undo multiplication with division.',[`Divide both sides by ${a}.`,`x = ${x}.`]);}
 ],
 [
  (n)=>{const a=n(2,7),b=n(2,7),c=n(1,9);return expression('Expressions','Simplify the expression.',`${a}x+${b}x+${c}`,`${a+b}x+${c}`,'Combine like terms.',[`${a}x + ${b}x = ${a+b}x.`,`The expression is ${a+b}x + ${c}.`]);},
  (n)=>{const a=n(2,8),b=n(2,8);return number('Integer multiplication','Calculate.',`(-${a})(-${b})`,a*b,'Two negatives multiply to a positive.',[`${a} × ${b} = ${a*b}. The sign is positive.`]);},
  (n)=>{const a=n(2,8),b=n(2,6),k=n(2,5);return number('Proportions','Solve for x.',String.raw`\frac{x}{${b*k}}=\frac{${a}}{${b}}`,a*k,'The denominator has been multiplied by the same factor as the numerator.',[`The scale factor is ${k}.`,`x = ${a} × ${k} = ${a*k}.`]);}
 ],
 [
  (n)=>{const a=n(2,8),b=n(2,12),x=n(2,10);return number('Linear equations','Solve for x.',`${a}x+${b}=${a*x+b}`,x,'Subtract the constant, then divide.',[`Subtract ${b}: ${a}x = ${a*x}.`,`Divide by ${a}: x = ${x}.`]);},
  (n)=>{const a=n(2,5);return number('Exponents','Evaluate.',`${a}^3`,a*a*a,'The exponent counts repeated factors.',[`${a} × ${a} × ${a} = ${a*a*a}.`]);},
  (n)=>{const a=n(5,14);return number('Square roots','Find the principal square root.',String.raw`\sqrt{${a*a}}`,a,'The principal square root is nonnegative.',[`${a}² = ${a*a}. The principal root is ${a}.`]);}
 ],
 [
  (n)=>{const x=n(2,8),y=n(1,7);return number('Systems of equations','Solve for x.',String.raw`\begin{cases}x+y=${x+y}\\x-y=${x-y}\end{cases}`,x,'Add the equations to eliminate y.',[`Adding gives 2x = ${2*x}.`,`Divide by 2: x = ${x}.`]);},
  (n)=>{const m=n(2,6),x=n(1,5),y=n(1,6);return number('Graphing','Find the slope through these points.',String.raw`(${x},${y}),\;(${x+3},${y+3*m})`,m,'Slope = change in y / change in x.',[`(${y+3*m} − ${y}) / (${x+3} − ${x}) = ${3*m}/3 = ${m}.`]);},
  (n)=>{const a=n(2,6),b=n(1,8);return expression('Expansion','Expand.',`${a}(x+${b})`,`${a}x+${a*b}`,'Distribute the factor to each term.',[`${a} × x + ${a} × ${b} = ${a}x + ${a*b}.`]);}
 ],
 [
  (n)=>{const a=n(1,5),b=n(a+1,a+6);return number('Quadratics','Find the smaller root.',`(x-${a})(x-${b})=0`,a,'Set each factor equal to zero.',[`The roots are ${a} and ${b}.`,`The smaller root is ${a}.`]);},
  (n)=>{const a=n(2,5),b=n(1,6),x=n(2,4);return number('Functions','Evaluate f at the given input.',String.raw`f(x)=${a}x^2-${b},\quad f(${x})=?`,a*x*x-b,'Square the input before multiplying.',[`f(${x}) = ${a} × ${x*x} − ${b} = ${a*x*x-b}.`]);},
  (n)=>{const k=n(1,5);return number('Trigonometry','In a right triangle, find sin θ. Opposite and hypotenuse are shown.',String.raw`\text{opposite}=${3*k},\quad\text{hypotenuse}=${5*k}`,'3/5','Sine = opposite / hypotenuse.',[`sin θ = ${3*k}/${5*k} = 3/5 = 0.6.`]);}
 ],
 [
  (n)=>{const b=n(2,5),p=n(2,4);return number('Logarithms','Evaluate.',String.raw`\log_{${b}}(${b**p})`,p,'A logarithm asks for an exponent.',[`${b} raised to ${p} is ${b**p}.`,`So the logarithm is ${p}.`]);},
  (n)=>{const a=n(2,7),r=n(2,4),k=n(4,6);return number('Geometric sequences',`Find term ${k} of the sequence.`,String.raw`${a},\;${a*r},\;${a*r*r},\ldots`,a*r**(k-1),'Use aₙ = a₁rⁿ⁻¹.',[`First term = ${a}; common ratio = ${r}.`,`Term ${k} = ${a} × ${r}^${k-1} = ${a*r**(k-1)}.`]);},
  (n)=>{const a=n(2,5),b=n(1,7);return expression('Function composition','Find f(g(x)).',String.raw`f(x)=${a}x+${b},\quad g(x)=x^2`,`${a}x^2+${b}`,'Replace the input of f with g(x).',[`Substitute x² into f.`,`f(g(x)) = ${a}x² + ${b}.`]);}
 ],
 [
  (n)=>{const a=n(2,9);return number('Limits','Evaluate the limit.',String.raw`\lim_{x\to${a}}\frac{x^2-${a*a}}{x-${a}}`,2*a,'Factor the numerator before taking the limit.',[`x² − ${a*a} = (x − ${a})(x + ${a}).`,`For x ≠ ${a}, cancel x − ${a}.`,`The limit of x + ${a} is ${2*a}.`]);},
  (n,r)=>choice('Trig identities','Which expression is equal wherever the original is defined?',String.raw`\frac{1-\cos^2 x}{\sin x}`,String.raw`\sin x`,[String.raw`\cos x`,String.raw`\tan x`,String.raw`\sin^2 x`],'Use sin²x + cos²x = 1.',['Replace 1 − cos²x with sin²x.','Divide sin²x by sin x to get sin x (sin x ≠ 0).'],r),
  (n)=>{const a=n(2,6),b=n(1,5);return number('Exponential equations','Solve for x.',`${a}^{x+${b}}=${a**(b+2)}`,2,'Express both sides with the same base.',[`The right side is ${a}^${b+2}.`,`x + ${b} = ${b+2}, so x = 2.`]);}
 ],
 [
  (n)=>{const a=n(2,6),b=n(1,7);return expression('Chain rule','Differentiate with respect to x.',`(${a}x+${b})^3`,`${3*a}(${a}x+${b})^2`,'Differentiate the outside, then multiply by the derivative of the inside.',[`The derivative of u³ is 3u².`,`The derivative of ${a}x + ${b} is ${a}.`,`Multiply: ${3*a}(${a}x + ${b})².`]);},
  (n)=>{const a=n(2,7);return expression('Product rule','Differentiate with respect to x.',`x^2(x+${a})`,`3x^2+${2*a}x`,'Use (uv)′ = u′v + uv′.',[`u = x², v = x + ${a}.`,`f′ = 2x(x + ${a}) + x² = 3x² + ${2*a}x.`]);},
  (n)=>{const a=n(1,6),b=n(2,6);return number('Quotient rule','Find f′(0).',String.raw`f(x)=\frac{x+${a}}{x+${b}}`,`${b-a}/${b*b}`,'Use (u′v − uv′) / v².',[`f′(x) = ((x + ${b}) − (x + ${a}))/(x + ${b})².`,`At x = 0, the derivative is ${b-a}/${b*b}.`]);},
  (n)=>{const x=n(1,5),y=n(2,7);return number('Implicit differentiation',`Find dy/dx at (${x}, ${y}).`,`x^2+y^2=${x*x+y*y}`,`${-x}/${y}`,'Differentiate both sides; y depends on x.',[`2x + 2y(dy/dx) = 0.`,`dy/dx = −x/y = −${x}/${y}.`]);},
  (n)=>{const p=n(5,15)*4;return number('Optimization',`A rectangle has perimeter ${p}. What is the maximum possible area?`,'',p*p/16,'Express area in terms of one side and set its derivative to zero.',[`If one side is x, the other is ${p/2} − x.`,`A(x) = ${p/2}x − x²; A′(x) = ${p/2} − 2x.`,`The critical point x = ${p/4} is a maximum since A″ = −2.`,`The area is ${p*p/16}.`]);},
  (n)=>{const a=n(2,8),b=n(2,6);return number('Definite integrals','Evaluate.',String.raw`\int_0^{${b}} ${a}x\,dx`,`${a*b*b}/2`,'Find an antiderivative, then apply the bounds.',[`An antiderivative is (${a}/2)x².`,`Evaluate at ${b} and subtract the value at 0: ${a*b*b}/2.`]);},
  (n)=>{const a=n(2,7),b=n(1,8);return {...expression('Indefinite integrals','Integrate. Include + C.',String.raw`\int (${3*a}x^2+${b})\,dx`,`${a}x^3+${b}x+C`,'Increase each power by one and divide by the new power.',[`The integral of ${3*a}x² is ${a}x³.`,`The integral of ${b} is ${b}x.`,`Combine and add the arbitrary constant: ${a}x³ + ${b}x + C.`]),type:'integral'};},
  (n)=>{const a=n(2,7),b=n(2,5);return number('Accumulation',`Velocity is v(t) = ${a}t metres/second. How far is travelled from t = 0 to t = ${b}?`,String.raw`\int_0^{${b}}${a}t\,dt`,`${a*b*b}/2`,'Velocity is nonnegative here, so distance is its definite integral.',[`Integrate velocity: (${a}/2)t².`,`Evaluate from 0 to ${b}: ${a*b*b}/2 metres.`]);},
  (n)=>{const a=n(1,6),b=n(1,6),c=n(1,6),d=n(1,6);return number('Matrices','Find the determinant.',String.raw`\begin{vmatrix}${a}&${b}\\${c}&${d}\end{vmatrix}`,a*d-b*c,'For a 2×2 matrix, det = ad − bc.',[`${a} × ${d} − ${b} × ${c} = ${a*d-b*c}.`]);},
  (n)=>{const a=n(2,8),b=n(2,8);return number('Vectors','Find the dot product.',String.raw`(${a},2)\cdot(3,${b})`,3*a+2*b,'Multiply matching coordinates, then add.',[`${a} × 3 + 2 × ${b} = ${3*a+2*b}.`]);},
  (n)=>{const a=n(2,8);return number('Trigonometric limits','Evaluate. Angles are in radians.',String.raw`\lim_{x\to0}\frac{\sin(${a}x)}{x}`,a,'Use lim sin u / u = 1 as u → 0.',[`Rewrite as ${a} × sin(${a}x)/(${a}x).`,`The second factor tends to 1, so the limit is ${a}.`]);}
 ]
];
export function generateQuestion(stage,seed,previousId){
  if(!Number.isInteger(stage)||stage<0||stage>=LEVELS.length)throw Error('Unknown stage');
  const r=seeded(seed),n=(a,b)=>Math.floor(r()*(b-a+1))+a;
  let q;
  for(let attempt=0;attempt<32;attempt++){
    const index=n(0,TEMPLATES[stage].length-1);q=TEMPLATES[stage][index](n,r);q={...q,stage,template:index,id:`${stage}:${index}:${q.prompt}:${q.tex}`};
    if(q.id!==previousId)return q;
  }
  return q;
}
