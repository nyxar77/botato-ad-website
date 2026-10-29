type Pt = [number, number];

/**
 * Pure 2D affine CSS matrix(a, b, c, d, tx, ty) that maps a w×h box
 * (with transform-origin 0 0) onto the screen's [TL, TR, BR, BL] corners.
 * Using a 2D matrix instead of projective 3D matrix3d avoids browser
 * Z-plane depth-fighting where child text gets clipped behind the white background.
 */
export function quadTransform(w: number, h: number, dst: [Pt, Pt, Pt, Pt]): string {
  const [tl, tr, br, bl] = dst;
  // Average top/bottom and left/right edge vectors for best parallelogram fit
  const ux = (tr[0] - tl[0] + (br[0] - bl[0])) / 2;
  const uy = (tr[1] - tl[1] + (br[1] - bl[1])) / 2;
  const vx = (bl[0] - tl[0] + (br[0] - tr[0])) / 2;
  const vy = (bl[1] - tl[1] + (br[1] - tr[1])) / 2;

  const a = ux / w;
  const b = uy / w;
  const c = vx / h;
  const d = vy / h;
  const tx = tl[0];
  const ty = tl[1];

  return `matrix(${[a, b, c, d, tx, ty].map((n) => +n.toFixed(6)).join(',')})`;
}
