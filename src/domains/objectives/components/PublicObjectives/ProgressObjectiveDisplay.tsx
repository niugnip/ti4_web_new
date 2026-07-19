import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon";
import { Text, Group } from "@mantine/core";
import { IconCheck, IconQuestionMark } from "@tabler/icons-react";
import styles from "./ExpandedObjectiveCard.module.css";
import { ScoreTier } from "@/utils/objectiveScoreTiers";

type ProgressObjectiveDisplayProps = {
  tier: ScoreTier;
  progressThreshold: number;
  ownProgress: number | null;
  /** Raw per-faction progress from the backend. Only redacted (key absent) for players the
   * viewer can't see stats of - when a real number is present (e.g. the GM's unfiltered view,
   * which redacts nothing), show it instead of "?". */
  factionProgress: Record<string, number>;
};

function Badge({
  completed,
  children,
}: {
  completed: boolean;
  children: React.ReactNode;
}) {
  return (
    <Group
      className={`${styles.factionProgressBadge} ${completed ? styles.completed : ""}`}
      gap={4}
    >
      {children}
    </Group>
  );
}

function ProgressObjectiveDisplay({
  tier,
  progressThreshold,
  ownProgress,
  factionProgress,
}: ProgressObjectiveDisplayProps) {
  const { ownFaction, ownScored, identifiedScorers, identifiedUnscored, anonymousScorers } =
    tier;

  return (
    <>
      {ownFaction && (
        <Badge completed={ownScored}>
          <CircularFactionIcon faction={ownFaction} size={23} />
          {ownScored ? (
            <IconCheck size={14} color="var(--mantine-color-green-5)" />
          ) : (
            <Text className={styles.progressBadgeText}>
              {ownProgress ?? 0}/{progressThreshold}
            </Text>
          )}
        </Badge>
      )}

      {identifiedScorers.map((player) => (
        <Badge key={player.faction} completed>
          <CircularFactionIcon
            faction={player.faction}
            factionImageOverride={player.factionImage}
            factionImageTypeOverride={player.factionImageType}
            size={23}
          />
          <IconCheck size={14} color="var(--mantine-color-green-5)" />
        </Badge>
      ))}

      {identifiedUnscored.map((player) => {
        const realProgress = factionProgress[player.faction];
        return (
          <Badge key={player.faction} completed={false}>
            <CircularFactionIcon
              faction={player.faction}
              factionImageOverride={player.factionImage}
              factionImageTypeOverride={player.factionImageType}
              size={23}
            />
            {realProgress !== undefined ? (
              <Text className={styles.progressBadgeText}>
                {realProgress}/{progressThreshold}
              </Text>
            ) : (
              <IconQuestionMark size={14} color="var(--mantine-color-gray-4)" />
            )}
          </Badge>
        );
      })}

      {/* Scored by a player the viewer can't identify: generic token only, no faction icon.
          Position is shuffled per-objective (see objectiveScoreTiers) so it can't be used to
          tell whether the same hidden player scored multiple objectives. */}
      {anonymousScorers.map((faction) => (
        <Badge key={faction} completed>
          <div className={styles.anonymousToken} title="Unidentified player" />
          <IconCheck size={14} color="var(--mantine-color-gray-5)" />
        </Badge>
      ))}
    </>
  );
}

export default ProgressObjectiveDisplay;
