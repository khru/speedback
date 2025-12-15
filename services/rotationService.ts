import { Member, Round, Pair } from '../types';

// Utility to shuffle an array (Fisher-Yates)
const shuffle = <T>(array: T[]): T[] => {
  let currentIndex = array.length,  randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
};

/**
 * Generates a Round-Robin schedule.
 * Now creates a copy and shuffles input first to ensure "Regenerate" creates variations.
 */
export const generateRotationSchedule = (members: Member[]): Round[] => {
  if (members.length < 2) return [];

  // Shuffle the pool to ensure different pairings order when regenerating
  let pool = shuffle([...members]);
  
  // If odd, we add a dummy for "Bye" (Rest)
  const isOdd = pool.length % 2 !== 0;
  if (isOdd) {
    pool.push({ id: 'BYE', name: 'BYE' });
  }

  const n = pool.length; // n is now always even
  const totalRounds = n - 1;
  const rounds: Round[] = [];

  for (let r = 0; r < totalRounds; r++) {
    const roundPairs: Pair[] = [];
    let restingMember: Member | null = null;

    for (let i = 0; i < n / 2; i++) {
      const m1 = pool[i];
      const m2 = pool[n - 1 - i];

      if (m1.id === 'BYE') {
        restingMember = m2;
      } else if (m2.id === 'BYE') {
        restingMember = m1;
      } else {
        roundPairs.push({ member1: m1, member2: m2 });
      }
    }

    rounds.push({
      roundNumber: r + 1,
      pairs: roundPairs,
      restingMember: restingMember
    });

    // Rotation Logic: Keep index 0 fixed, rotate the rest clockwise
    // [0, 1, 2, 3, 4, 5] -> [0, 5, 1, 2, 3, 4]
    const fixed = pool[0];
    const rotated = [fixed, pool[n - 1], ...pool.slice(1, n - 1)];
    pool = rotated;
  }

  return rounds;
};