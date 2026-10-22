// Exact rational polynomial arithmetic. No eval, code execution, or sampling.
const gcd = (a,b) => b ? gcd(b,a%b) : a < 0n ? -a : a;
function rat(n,d=1n) { if (!d) throw Error('Division by zero'); const g=gcd(n,d); return [n/g*(d<0n?-1n:1n),d/g*(d<0n?-1n:1n)]; }
const add=(a,b)=>rat(a[0]*b[1]+b[0]*a[1],a[1]*b[1]);
const mul=(a,b)=>rat(a[0]*b[0],a[1]*b[1]);
const zero=()=>[0n,1n];
const trim=p=>{while(p.length>1&&p.at(-1)[0]===0n)p.pop();return p;};
function plus(a,b,sign=1n){return trim(Array.from({length:Math.max(a.length,b.length)},(_,i)=>add(a[i]||zero(),mul(b[i]||zero(),[sign,1n]))));}
function times(a,b){if(a.length+b.length>22)throw Error('Degree too large');const out=Array.from({length:a.length+b.length-1},zero);a.forEach((x,i)=>b.forEach((y,j)=>out[i+j]=add(out[i+j],mul(x,y))));return trim(out);}
function decimal(s){const [a,b='']=s.split('.');return rat(BigInt((a||'0')+b),10n**BigInt(b.length));}
export function polynomial(raw){
  const text=String(raw).replace(/\s+/g,'').replace(/[−–]/g,'-').replace(/×/g,'*').replace(/÷/g,'/').toLowerCase();
  if(!text||text.length>160)throw Error('Enter a shorter expression');
  const tokens=text.match(/(?:\d+(?:\.\d*)?|\.\d+)|[x()+*/^\-]/g)||[];
  if(tokens.join('')!==text||tokens.length>100)throw Error('Use numbers, x, parentheses, +, -, *, /, and ^');
  if(tokens.some((t,i)=>i>0&&/^[\d.]/.test(t)&&/^[\d.]/.test(tokens[i-1])))throw Error('Separate numbers with an operator');
  let at=0,depth=0;
  function atom(){if(++depth>20)throw Error('Too many parentheses');let p;const t=tokens[at++];if(t==='('){p=sum();if(tokens[at++]!==')')throw Error('Close the parentheses');}else if(t==='x')p=[zero(),[1n,1n]];else if(t&&/^[\d.]/.test(t))p=[decimal(t)];else throw Error('Check the expression');depth--;return p;}
  function power(){let p=atom();if(tokens[at]==='^'){at++;const t=tokens[at++];if(!/^\d+$/.test(t||'')||Number(t)>10)throw Error('Use a whole-number power from 0 to 10');let out=[[1n,1n]];for(let n=0;n<Number(t);n++)out=times(out,p);p=out;}return p;}
  function signed(){if(tokens[at]==='+'){at++;return signed();}if(tokens[at]==='-'){at++;return times([[-1n,1n]],signed());}return power();}
  function product(){let p=signed();while(at<tokens.length){const t=tokens[at];if(t==='*'||t==='/'){at++;const q=signed();if(t==='/'){if(q.length!==1)throw Error('Only division by constants is supported');p=p.map(c=>mul(c,rat(q[0][1],q[0][0])));}else p=times(p,q);}else if(t==='('||t==='x'||/^[\d.]/.test(t)){p=times(p,signed());}else break;}return trim(p);}
  function sum(){let p=product();while(tokens[at]==='+'||tokens[at]==='-'){const sign=tokens[at++]==='+'?1n:-1n;p=plus(p,product(),sign);}return p;}
  const result=sum();if(at!==tokens.length)throw Error('Check the expression');return result;
}
export function checkAnswer(question, raw){
  if(!String(raw).trim())return {valid:false,correct:false,message:'Enter an answer first.'};
  if(question.type==='choice')return {valid:true,correct:String(raw)===question.answer};
  try{
    let input=String(raw),expected=String(question.answer);
    if(question.type==='integral'){
      if(!/\+\s*c\s*$/i.test(input))return {valid:false,correct:false,message:'Include + C for the constant of integration.'};
      input=input.replace(/\+\s*c\s*$/i,'');expected=expected.replace(/\+\s*c\s*$/i,'');
    }
    const left=polynomial(input),right=polynomial(expected);
    if(question.type==='number'){
      if(left.length!==1)return {valid:false,correct:false,message:'This question needs a number, decimal, or fraction.'};
      const value=Number(left[0][0])/Number(left[0][1]),target=Number(right[0][0])/Number(right[0][1]);
      return {valid:true,correct:Math.abs(value-target)<=(question.tolerance??1e-9)};
    }
    // An arbitrary additive constant is absorbed into C for antiderivatives.
    const start=question.type==='integral'?1:0;
    const correct=Array.from({length:Math.max(left.length,right.length)},(_,i)=>i).slice(start).every(i=>{const a=left[i]||zero(),b=right[i]||zero();return a[0]===b[0]&&a[1]===b[1];});
    return {valid:true,correct};
  }catch(error){return {valid:false,correct:false,message:error.message};}
}
