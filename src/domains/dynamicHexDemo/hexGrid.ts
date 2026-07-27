export type AxialCoord = { q: number; r: number };

export type HexContent = {
  planets: number;
  ships: number;
  tokens: number;
};

export const RINGS = 2;
export const BASE_RADIUS = 62;
export const INNER_RING_MAX_SCALE = 2.3;
export const OUTER_RING_MAX_SCALE = 1.5;
export const MIN_SCALE = 0.65;

export function hexId({ q, r }: AxialCoord): string {
  return `${q},${r}`;
}

export function ringOf({ q, r }: AxialCoord): number {
  return Math.max(Math.abs(q), Math.abs(r), Math.abs(-q - r));
}

export function generateHexField(rings: number): AxialCoord[] {
  const coords: AxialCoord[] = [];
  for (let q = -rings; q <= rings; q++) {
    for (let r = -rings; r <= rings; r++) {
      if (ringOf({ q, r }) <= rings) coords.push({ q, r });
    }
  }
  return coords;
}

export function hexToPixel(coord: AxialCoord, size: number) {
  return {
    x: size * 1.5 * coord.q,
    y: size * Math.sqrt(3) * (coord.r + coord.q / 2),
  };
}

export function hexBoxSize(radius: number) {
  return { width: radius * 2, height: radius * Math.sqrt(3) };
}

export function maxScaleForRing(coord: AxialCoord): number {
  return ringOf(coord) >= RINGS ? OUTER_RING_MAX_SCALE : INNER_RING_MAX_SCALE;
}

export function scaleForContent(content: HexContent, coord: AxialCoord): number {
  const raw =
    1 +
    content.planets * 0.2 +
    content.ships * 0.07 +
    content.tokens * 0.11;
  return Math.min(maxScaleForRing(coord), Math.max(MIN_SCALE, raw));
}

export function emptyContent(): HexContent {
  return { planets: 0, ships: 0, tokens: 0 };
}

export function randomContent(): HexContent {
  return {
    planets: Math.random() < 0.7 ? Math.floor(Math.random() * 4) : 0,
    ships: Math.random() < 0.6 ? Math.floor(Math.random() * 9) : 0,
    tokens: Math.random() < 0.5 ? Math.floor(Math.random() * 5) : 0,
  };
}
