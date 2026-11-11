// Time Attack: answer as many questions as you can in 60 seconds.
// Questions climb a grade every two correct answers (capped at Grade 9), and
// answering in a row builds a combo multiplier. Pure state, no DOM.
import { generateQuestion } from './questions.mjs';
import { checkAnswer } from './answers.mjs';

export const DURATION = 60000;
export const MAX_STAGE = 9;

export function newAttack(seed) {
  return { seed: seed >>> 0, index: 0, score: 0, combo: 0, bestCombo: 0, correct: 0, wrong: 0, status: 'ready' };
}
export const attackStage = attack => Math.min(Math.floor(attack.correct / 2), MAX_STAGE);
export const multiplier = combo => Math.min(1 + Math.floor(combo / 3), 5);
export function attackQuestion(attack) {
  return generateQuestion(attackStage(attack), (attack.seed + attack.index * 7919) >>> 0);
}

/** Returns { attack, valid, correct, points, message }. Invalid input (bad format) costs nothing. */
export function answerAttack(attack, input) {
  if (attack.status !== 'playing') return { attack, valid: false, correct: false, points: 0 };
  const stage = attackStage(attack), result = checkAnswer(attackQuestion(attack), input);
  if (!result.valid) return { attack, ...result, points: 0 };
  if (!result.correct) return { attack: { ...attack, index: attack.index + 1, combo: 0, wrong: attack.wrong + 1 }, ...result, points: 0 };
  const combo = attack.combo + 1, points = 10 * (stage + 1) * multiplier(combo);
  return {
    attack: { ...attack, index: attack.index + 1, combo, bestCombo: Math.max(attack.bestCombo, combo), correct: attack.correct + 1, score: attack.score + points },
    ...result, points,
  };
}
export const skipQuestion = attack => attack.status === 'playing' ? { ...attack, index: attack.index + 1, combo: 0 } : attack;

export function attackText(attack, best) {
  return `Math Ascension · Time Attack ⏱️\n${attack.score} points · ${attack.correct} correct · best streak ${attack.bestCombo} in a row${best && attack.score >= best ? '\n🏆 New personal best!' : ''}\nhttps://masonwang.dev/projects/math-ascension/index.html`;
}
