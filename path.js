export class PathMe {
  constructor() {
    this.moves = [];
  }

  moveTo(x, y) {
    this.moves.push(`M ${x} ${y}`);
    return this;
  }

  closePath() {
    this.moves.push('Z');
    return this;
  }

  lineTo(x, y) {
    this.moves.push(`L ${x} ${y}`);
    return this;
  }

  horizontalLineTo(x) {
    this.moves.push(`H ${x}`);
    return this;
  }

  verticalLineTo(y) {
    this.moves.push(`V ${y}`);
    return this;
  }

  curveTo(x1, y1, x2, y2, x, y) {
    this.moves.push(`C ${x1} ${y1} ${x2} ${y2} ${x} ${y}`);
    return this;
  }

  smoothCurveTo(x2, y2, x, y) {
    this.moves.push(`S ${x2} ${y2} ${x} ${y}`);
    return this;
  }

  quadraticCurveTo(x1, y1, x, y) {
    this.moves.push(`Q ${x1} ${y1} ${x} ${y}`);
    return this;
  }

  smoothQuadraticCurveTo(x, y) {
    this.moves.push(`T ${x} ${y}`);
    return this;
  }

  arc(rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y) {
    const largeArc = largeArcFlag ? 1 : 0;
    const sweep = sweepFlag ? 1 : 0;
    this.moves.push(`A ${rx} ${ry} ${xAxisRotation} ${largeArc} ${sweep} ${x} ${y}`);
    return this;
  }

  catmullRomCurveTo(x1, y1, x, y) {
    this.moves.push(`R ${x1} ${y1} ${x} ${y}`);
    return this;
  }

  toString() {
    return this.moves.join(' ');
  }
}
