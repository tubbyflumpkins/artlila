export const BOARD_CONFIG = {
  width: 500,
  height: 600,
  pegRadius: 6,
  ballRadius: 12,
  slotHeight: 60,
  paddingX: 40,
  paddingTop: 60,
  numSlots: 10,
  pegRows: 8,
  wallThickness: 10,
  dividerWidth: 3,
  dividerHeight: 50,
};

export interface PegPosition {
  x: number;
  y: number;
}

/**
 * Generates quincunx (Galton board) peg positions.
 * Alternating rows of N-1 and N pegs, offset by half-spacing.
 */
export function generateQuincunxPegs(
  numSlots: number,
  width: number,
  height: number
): PegPosition[] {
  const pegs: PegPosition[] = [];
  const { paddingX, paddingTop, slotHeight, pegRows } = BOARD_CONFIG;

  const playableWidth = width - paddingX * 2;
  const playableHeight = height - paddingTop - slotHeight - 20;
  const rowSpacing = playableHeight / (pegRows + 1);
  const colSpacing = playableWidth / numSlots;

  for (let row = 0; row < pegRows; row++) {
    const y = paddingTop + rowSpacing * (row + 1);
    const isOffsetRow = row % 2 === 1;
    const numPegsInRow = isOffsetRow ? numSlots - 1 : numSlots;
    const offsetX = isOffsetRow ? colSpacing / 2 : 0;

    for (let col = 0; col <= numPegsInRow; col++) {
      const x = paddingX + offsetX + col * colSpacing;
      if (x > paddingX - 5 && x < width - paddingX + 5) {
        pegs.push({ x, y });
      }
    }
  }

  return pegs;
}

/**
 * Calculate slot boundaries for determining which slot a ball landed in.
 */
export function getSlotBoundaries(numSlots: number, width: number) {
  const { paddingX } = BOARD_CONFIG;
  const playableWidth = width - paddingX * 2;
  const slotWidth = playableWidth / numSlots;

  return Array.from({ length: numSlots }, (_, i) => ({
    left: paddingX + i * slotWidth,
    right: paddingX + (i + 1) * slotWidth,
    center: paddingX + (i + 0.5) * slotWidth,
  }));
}

/**
 * Determine which slot index a ball at position x falls into.
 */
export function getSlotIndex(x: number, numSlots: number, width: number): number {
  const { paddingX } = BOARD_CONFIG;
  const playableWidth = width - paddingX * 2;
  const slotWidth = playableWidth / numSlots;
  const index = Math.floor((x - paddingX) / slotWidth);
  return Math.max(0, Math.min(numSlots - 1, index));
}
