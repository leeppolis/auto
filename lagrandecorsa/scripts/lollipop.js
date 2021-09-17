
const lollipop = (svgW, svgH, years, total, persone) => {
  const svgL = d3.select('#line')
    .append('svg')
    .attr('width', svgW)
    .attr('height', lineChartHeight)
    .attr('viewbox', `0 0 ${svgW} 200`)
    .attr('preserveAspectRatio', 'xMidYMid meet');

  const gL = svgL.append('g');
  const gG = svgL.append('g');
  const gD = svgL.append('g');
  const gLB = svgL.append('g');

  let maxValue = Number.MIN_SAFE_INTEGER;
  let minValue = Number.MAX_SAFE_INTEGER;
  years.forEach((y, i) => {
    maxValue = total[y] > maxValue ? total[y] : maxValue;
    minValue = total[y] < minValue ? total[y] : minValue;
    maxValue = persone[y] > maxValue ? persone[y] : maxValue;
    minValue = persone[y] < minValue ? persone[y] : minValue;
  });
  const yScale = d3.scaleLinear()
    .domain([ minValue, maxValue ])
    .range([lineChartHeight - 40, 20]);
  let path = [`M${getXPos(0)} ${yScale(total[years[0]])}`];
  let path2 = [`M${getXPos(0)} ${yScale(persone[years[0]])}`];
  years.forEach((y, i) => {
    const xp = getXPos(i);
    const yp = yScale(total[y]);
    const yab = yScale(persone[y]);
    path.push(`L${xp} ${yp}`);
    path2.push(`L${xp} ${yab}`);

    gD.append('circle')
      .attr('cx', xp)
      .attr('cy', yp)
      .attr('r', 5)
      .attr('stroke', colors.DEFAULT)
      .attr('fill', colors.EMPTY)
      .attr('class','line-dot');

    gD.append('circle')
      .attr('cx', xp)
      .attr('cy', yab)
      .attr('r', 5)
      .attr('stroke', colors.DEFAULT)
      .attr('fill', colors.EMPTY)
      .attr('class','line-dot-ab');

    gLB.append('text')
      .attr('x', xp)
      .attr('y', yp)
      .attr('dy', -8)
      .attr('class','line-label')
      .attr('text-anchor', `${(i === years.length - 1 ? 'start' : (i === 0 ? 'end' : 'middle'))}`)
      .text(`${(i === 0 ? '🚘' : '')} ${formatNumber(total[y])} ${(i === years.length - 1 ? '🚘' : '')}`);

    gLB.append('text')
      .attr('x', xp)
      .attr('y', yab)
      .attr('dy', -8)
      .attr('class','line-label-ab')
      .attr('text-anchor', `${(i === years.length - 1 ? 'start' : (i === 0 ? 'end' : 'middle'))}`)
      .text(`${(i === 0 ? '👨‍' : '')} ${formatNumber(persone[y])} ${(i === years.length - 1 ? '👨‍' : '')}`);

    gLB.append('text')
      .attr('x', xp)
      .attr('y', lineChartHeight - 20)
      .attr('dy', 20)
      .attr('class','line-axis-label')
      .text(y);

    gG.append('line')
      .attr('x1', xp)
      .attr('x2', xp)
      .attr('y1', lineChartHeight - 20)
      .attr('y2', yp)
      .attr('stroke', colors.DEFAULT)
      .attr('class', 'line-guide');

    gG.append('line')
      .attr('x1', xp)
      .attr('x2', xp)
      .attr('y1', lineChartHeight - 20)
      .attr('y2', yab)
      .attr('stroke', colors.DEFAULT)
      .attr('class', 'line-guide-ab');
  });
  gL.append('path')
    .attr('d', path.join(','))
    .attr('stroke', colors.NEUTRAL)
    .attr('class', 'line-line');
  gL.append('path')
    .attr('d', path2.join(','))
    .attr('stroke', colors.NEUTRAL)
    .attr('class', 'line-line-2');

  const legend = d3.select('#line')
    .append('div')
      .attr('class', 'line-legend');
  
    legend.append('div')
      .attr('class', 'legend-residente')
      .text('👨‍🦲 Residenti');
  
  legend.append('div')
    .attr('class', 'legend-auto')
    .text('🚘 Veicoli');
};
