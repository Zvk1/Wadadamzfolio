export function pipelineGeometry(width, height, sectionTops) {
  const gutter = Math.max(6, Math.min(28, width * .018));
  const inset = Math.min(60, width * .03);
  const route = side => {
    const outer = side === 'left' ? gutter : width - gutter;
    const direction = side === 'left' ? 1 : -1;
    let path = `M${outer} 0`;
    let last = 0;
    sectionTops.forEach((top, index) => {
      // Different detours and junction heights on either side, not mirrored rails.
      const sideOffset = side === 'left' ? 0 : 75;
      const y = Math.max(last + 100, Math.min(top + sideOffset, height - 180));
      if (y + 160 >= height) return;
      const depth = inset * [1, .45, .8, .6][(index + (side === 'left' ? 0 : 2)) % 4];
      const inner = outer + direction * depth;
      const run = [60, 120, 85, 145][index % 4];
      if (y + run + 32 >= height) return;
      path += ` V${y - 32} L${inner} ${y} V${y + run} L${outer} ${y + run + 32}`;
      last = y + run + 32;
    });
    return `${path} V${height}`;
  };
  return [route('left'), route('right')];
}

// Cross-page routes sit in the empty space between sections. Short feeder
// branches turn into the outer rails without drawing over reading content.
export function pipelineBranches(width, height, sectionTops) {
  const edge = Math.max(6, Math.min(28, width * .018));
  return sectionTops.slice(1).flatMap((top, index) => {
    const y = Math.max(80, Math.min(top - 28, height - 120));
    const bend = Math.min(28, width * .045);
    const start = index % 2 ? width - edge : edge;
    const end = index % 2 ? edge : width - edge;
    const direction = index % 2 ? -1 : 1;
    const joint = start + (end - start) * [.32, .68, .44, .56][index % 4];
    return [
      `M${start} ${y - bend} L${start + direction * bend} ${y} H${joint} L${joint + direction * bend} ${y + bend} H${end}`,
      `M${start} ${y - 68} V${y - 44} L${start + direction * bend} ${y - 20} H${joint - direction * bend} L${joint} ${y}`,
    ];
  });
}

export function scrollProgress(scrollY, viewportHeight, pageHeight) {
  if (scrollY + viewportHeight >= pageHeight - 3) return 1;
  return Math.max(0, Math.min(1, (scrollY + viewportHeight * .8) / Math.max(1, pageHeight)));
}
