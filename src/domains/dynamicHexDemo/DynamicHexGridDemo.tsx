import { useMemo, useState } from "react";
import { Button, Title } from "@mantine/core";
import {
  IconDice5,
  IconDisc,
  IconRefresh,
  IconRocket,
  IconWorld,
} from "@tabler/icons-react";
import {
  type AxialCoord,
  type HexContent,
  BASE_RADIUS,
  emptyContent,
  generateHexField,
  hexBoxSize,
  hexId,
  hexToPixel,
  randomContent,
  RINGS,
  scaleForContent,
} from "./hexGrid";
import styles from "./DynamicHexGridDemo.module.css";

const FIELD = generateHexField(RINGS);
const BOX = hexBoxSize(BASE_RADIUS);

function floatDelay(coord: AxialCoord): number {
  const seed = Math.abs(coord.q * 31 + coord.r * 17);
  return (seed % 60) / 10;
}

function buildInitialContents(): Record<string, HexContent> {
  const contents: Record<string, HexContent> = {};
  for (const coord of FIELD) {
    contents[hexId(coord)] = randomContent();
  }
  return contents;
}

/** Quick throwaway mockup: hexes "inflate" to reflect their content while the grid's outer footprint stays put. */
export default function DynamicHexGridDemo() {
  const [contents, setContents] = useState<Record<string, HexContent>>(
    buildInitialContents,
  );

  const positions = useMemo(() => {
    const pts = FIELD.map((coord) => ({
      coord,
      ...hexToPixel(coord, BASE_RADIUS),
    }));
    const xs = pts.map((p) => p.x);
    const ys = pts.map((p) => p.y);
    const maxScale = 2.3;
    const pad = BASE_RADIUS * maxScale + 60;
    const minX = Math.min(...xs) - pad;
    const maxX = Math.max(...xs) + pad;
    const minY = Math.min(...ys) - pad;
    const maxY = Math.max(...ys) + pad;
    return {
      pts: pts.map((p) => ({ ...p, x: p.x - minX, y: p.y - minY })),
      width: maxX - minX,
      height: maxY - minY,
    };
  }, []);

  const updateContent = (id: string, updater: (c: HexContent) => HexContent) => {
    setContents((prev) => ({ ...prev, [id]: updater(prev[id] ?? emptyContent()) }));
  };

  const addShip = (id: string) =>
    updateContent(id, (c) => ({ ...c, ships: Math.min(12, c.ships + 1) }));
  const addPlanet = (id: string) =>
    updateContent(id, (c) => ({ ...c, planets: Math.min(6, c.planets + 1) }));
  const addToken = (id: string) =>
    updateContent(id, (c) => ({ ...c, tokens: Math.min(8, c.tokens + 1) }));
  const removeShip = (id: string) =>
    updateContent(id, (c) => ({ ...c, ships: Math.max(0, c.ships - 1) }));
  const resetHex = (id: string) => updateContent(id, () => emptyContent());

  const randomizeAll = () => {
    const next: Record<string, HexContent> = {};
    for (const coord of FIELD) next[hexId(coord)] = randomContent();
    setContents(next);
  };

  const resetAll = () => {
    const next: Record<string, HexContent> = {};
    for (const coord of FIELD) next[hexId(coord)] = emptyContent();
    setContents(next);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Title order={2}>Dynamic Hex Galaxy</Title>
        <div className={styles.subtitle}>
          A silly gimmick: hexes balloon up as you stuff planets, ships and
          tokens into them. Grid positions stay fixed — only the tile size
          reacts.
        </div>
      </div>

      <div className={styles.toolbarRow}>
        <Button
          size="xs"
          variant="light"
          leftSection={<IconDice5 size={14} />}
          onClick={randomizeAll}
        >
          Randomize all
        </Button>
        <Button
          size="xs"
          variant="subtle"
          color="gray"
          leftSection={<IconRefresh size={14} />}
          onClick={resetAll}
        >
          Reset all
        </Button>
      </div>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <IconWorld size={13} color="var(--mantine-color-green-4)" /> planets
        </span>
        <span className={styles.legendItem}>
          <IconRocket size={13} color="var(--mantine-color-blue-4)" /> ships
        </span>
        <span className={styles.legendItem}>
          <IconDisc size={13} color="var(--mantine-color-yellow-5)" /> tokens
        </span>
        <span className={styles.legendItem}>
          click a hex to add a ship &middot; hover for more options
        </span>
      </div>

      <div className={styles.field}>
        <div
          className={styles.fieldInner}
          style={{ width: positions.width, height: positions.height }}
        >
          {positions.pts.map(({ coord, x, y }) => {
            const id = hexId(coord);
            const content = contents[id] ?? emptyContent();
            const scale = scaleForContent(content, coord);
            const hasContent =
              content.planets > 0 || content.ships > 0 || content.tokens > 0;

            return (
              <div
                key={id}
                className={styles.slot}
                style={{ left: x, top: y, zIndex: Math.round(scale * 100) }}
              >
                <div
                  className={styles.hexVisual}
                  style={
                    {
                      width: BOX.width,
                      height: BOX.height,
                      transform: `scale(${scale})`,
                      "--float-delay": `${floatDelay(coord)}s`,
                    } as React.CSSProperties
                  }
                  onClick={() => addShip(id)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    removeShip(id);
                  }}
                  role="button"
                  aria-label={`System ${id}`}
                >
                  <div className={styles.hexShape}>
                    <div className={styles.hexContent}>
                      <span className={styles.hexIndex}>{id}</span>
                      {!hasContent && (
                        <span className={styles.emptyHint}>empty</span>
                      )}
                      {content.planets > 0 && (
                        <span className={`${styles.statRow} ${styles.statPlanets}`}>
                          <IconWorld size={11} /> {content.planets}
                        </span>
                      )}
                      {content.ships > 0 && (
                        <span className={`${styles.statRow} ${styles.statShips}`}>
                          <IconRocket size={11} /> {content.ships}
                        </span>
                      )}
                      {content.tokens > 0 && (
                        <span className={`${styles.statRow} ${styles.statTokens}`}>
                          <IconDisc size={11} /> {content.tokens}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.toolbar}>
                  <button
                    className={styles.toolbarBtn}
                    title="Add planet"
                    onClick={() => addPlanet(id)}
                  >
                    <IconWorld size={13} />
                  </button>
                  <button
                    className={styles.toolbarBtn}
                    title="Add ship"
                    onClick={() => addShip(id)}
                  >
                    <IconRocket size={13} />
                  </button>
                  <button
                    className={styles.toolbarBtn}
                    title="Add token"
                    onClick={() => addToken(id)}
                  >
                    <IconDisc size={13} />
                  </button>
                  <button
                    className={styles.toolbarBtn}
                    title="Reset hex"
                    onClick={() => resetHex(id)}
                  >
                    <IconRefresh size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
