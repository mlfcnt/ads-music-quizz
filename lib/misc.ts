export const emojiByRanking = (ranking: number) => {
  if (ranking === 1) return "🥇";
  if (ranking === 2) return "🥈";
  if (ranking === 3) return "🥉";
  return "";
};
