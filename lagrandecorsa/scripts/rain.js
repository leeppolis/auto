
const rain = (svgW, years, pioggia) => {
  const svgL = d3.select('#rain')
    .append('svg')
    .attr('width', svgW)
    .attr('height', lineChartHeight)
    .attr('viewbox', `0 0 ${svgW} 200`)
    .attr('preserveAspectRatio', 'xMidYMid meet');

  const gL = svgL.append('g');
  const gG = svgL.append('g');
  const gD = svgL.append('g');
  const gLB = svgL.append('g');

  const data = [];

  years.forEach((y, i) => {
    data.push(pioggia[y])
  })

  const maxValue = d3.max(data);
  const yScale = d3.scaleLinear()
    .domain([ 0, maxValue ])
    .range([lineChartHeight - 40, 20]);

  let path = [`M${getXPos(0)} ${yScale(pioggia[years[0]])}`];
  
  years.forEach((y, i) => {
    const xp = getXPos(i);
    const yp = yScale(pioggia[y]);
    path.push(`L${xp} ${yp}`);

    gD.append('circle')
      .attr('cx', xp)
      .attr('cy', yp)
      .attr('r', 5)
      .attr('stroke', colors.DEFAULT)
      .attr('fill', colors.EMPTY)
      .attr('class','line-dot');

    gLB.append('text')
      .attr('x', xp)
      .attr('y', yp)
      .attr('dy', -8)
      .attr('class','line-label')
      .attr('text-anchor', `${(i === years.length - 1 ? 'start' : (i === 0 ? 'end' : 'middle'))}`)
      .text(`${formatNumber(pioggia[y])} ${(i === 0 ? 'mm' : '')}`);

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
  });
  gL.append('path')
    .attr('d', path.join(','))
    .attr('stroke', colors.NEUTRAL)
    .attr('class', 'line-line');

  const legend = d3.select('#rain')
    .append('div')
      .attr('class', 'line-legend');
  
    legend.append('div')
      .attr('class', 'legend')
      .text('mm di Pioggia Annuali');
};
