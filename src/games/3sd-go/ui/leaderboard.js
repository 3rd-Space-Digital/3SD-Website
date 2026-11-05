/**
 * Friends list shown in the bottom-left card.
 * Replace getFriendsLeaderboard with a Supabase query later.
 * Keep the return shape: { id, name, score }.
 */
const DUMMY_FRIENDS = Object.freeze([
  Object.freeze({ id: 'curaru', name: 'curaru', score: 1254 }),
  Object.freeze({ id: 'hira', name: 'hira', score: 686 }),
  Object.freeze({ id: 'todoo', name: 'Todoo', score: 90 }),
]);

export function getFriendsLeaderboard() {
  return DUMMY_FRIENDS.map((row) => ({ ...row }));
}

export function leaderboardRows(playerScore) {
  const rows = getFriendsLeaderboard();
  rows.push({ id: 'you', name: 'You', score: playerScore, isPlayer: true });
  rows.sort((a, b) => b.score - a.score || (a.isPlayer ? 1 : 0));
  return rows;
}
