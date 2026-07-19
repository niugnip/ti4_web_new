import type { PlayerData } from "@/entities/data/types";

export type ScoreTier = {
  /** The viewer's own faction, if they're in this game. */
  ownFaction: string | null;
  ownScored: boolean;
  /** Other players the viewer can identify (present in playerData), who have scored. */
  identifiedScorers: PlayerData[];
  /** Other players the viewer can identify, who have NOT scored (still shown, with "?"). */
  identifiedUnscored: PlayerData[];
  /**
   * Scorers the viewer can't identify - real faction string kept only as a stable per-objective
   * sort/react key, never rendered. Order is shuffled per-objective (see sortAnonymous) so
   * position can't be used to correlate the same hidden player across different objective cards.
   */
  anonymousScorers: string[];
};

export function getOwnFaction(
  playerData: PlayerData[] | undefined,
  discordId: string | null | undefined
): string | null {
  if (!discordId) return null;
  return playerData?.find((p) => p.discordId === discordId)?.faction ?? null;
}

// Deterministic per-(objective, faction) shuffle key. Different objectives yield unrelated
// orderings for the same faction, so consistently-placed grey tokens can't be cross-referenced.
function shuffleKey(objectiveKey: string, faction: string): number {
  const s = `${objectiveKey}:${faction}`;
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 31 + s.charCodeAt(i)) | 0;
  }
  return hash;
}

export function computeScoreTier(
  objectiveKey: string,
  scoredFactions: string[],
  playerData: PlayerData[],
  ownFaction: string | null
): ScoreTier {
  const identifiedFactions = new Set(playerData.map((p) => p.faction));
  const scoredSet = new Set(scoredFactions);

  const identifiedScorers: PlayerData[] = [];
  const identifiedUnscored: PlayerData[] = [];
  for (const player of playerData) {
    if (player.faction === ownFaction) continue;
    if (scoredSet.has(player.faction)) {
      identifiedScorers.push(player);
    } else {
      identifiedUnscored.push(player);
    }
  }

  const anonymousScorers = scoredFactions
    .filter((f) => f !== ownFaction && !identifiedFactions.has(f))
    .sort(
      (a, b) => shuffleKey(objectiveKey, a) - shuffleKey(objectiveKey, b)
    );

  return {
    ownFaction,
    ownScored: ownFaction !== null && scoredSet.has(ownFaction),
    identifiedScorers,
    identifiedUnscored,
    anonymousScorers,
  };
}
