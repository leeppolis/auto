const smallMultiples = (years, data) => {
  const smallMultiples = {};
  let maxMax = Number.MIN_SAFE_INTEGER;
  let minMin = Number.MAX_SAFE_INTEGER;
  const chartHeight = 220;
  let chartWidth = 340;
  const margin = 80;
  const vMargin = 40;

  if (window.matchMedia('screen and (min-width:768px)').matches) {
    chartWidth = 340;
  } else if (window.matchMedia('screen and (min-width:1024px)').matches) {
    chartWidth = 460;
  } else if (window.matchMedia('screen and (min-width:1366px)').matches) {
    chartWidth = 380;
  }


  years.forEach((y, i) => {
    data.auto[y].forEach((c, i) => {
      if (!smallMultiples[c.classe]) {
        smallMultiples[c.classe] = [];
      }
      smallMultiples[c.classe].push(c.numero);
      if (c.numero > maxMax) {
        maxMax = c.numero;
      }
      if (c.numero < minMin) {
        minMin = c.numero;
      }
    });
  });
  const classes = Object.keys(smallMultiples);
  classes.sort().reverse();

  const wrapper = d3.select('#small-m');
  classes.forEach((c) => {
    const div = wrapper.append('div')
      .attr('class', `single single-${c}`)
      .attr('id', c);
    const container = div.append('div')
      .attr('class', 'container');
    container.append('h3')
      .text(dictionary[c]);
    // const increase = ((smallMultiples[c][smallMultiples[c].length - 1]) / smallMultiples[c][0]) - 1;
    // container.append('h4')
    //   .attr('class', 'increase')
    //   .text(formatPercentage(increase));



    const scaleX = d3.scaleLinear()
      .range([margin, chartWidth - (margin)])
      .domain([0, 12]);
    const scaleY = d3.scaleLinear()
      .range([chartHeight - (vMargin), vMargin])
      .domain([minMin, maxMax]);

    const area = d3.area()
      .x(p => p.x)
      .y1(p => p.y)
      .y0(chartHeight - vMargin)
      .curve(d3.curveCatmullRom.alpha(0.5));
    
    const line = d3.line()
      .x(p => p.x)
      .y(p => p.y)
      .curve(d3.curveCatmullRom.alpha(0.5));
    const data = smallMultiples[c].map((d, i) => ({ x: scaleX(i), y: scaleY(d)}));

    console.log('--', chartWidth);

    const svgS = container.append('svg')
      .attr('width', chartWidth)
      .attr('height', chartHeight)
      .attr('viewbox', `0 0 chartWidth 180`)
      .attr('preserveAspectRatio', 'xMidYMid meet');
    svgS.append('line')
      .attr('x1', margin)
      .attr('x2', chartWidth - (margin))
      .attr('y1', chartHeight - vMargin)
      .attr('y2', chartHeight - vMargin)
      .attr('stroke', colors.NEUTRAL)
      .attr('fill', 'none');
    svgS.append('line')
      .attr('x1', margin)
      .attr('x2', margin)
      .attr('y1', chartHeight - vMargin)
      .attr('y2', chartHeight - vMargin + 10)
      .attr('stroke', colors.NEUTRAL)
      .attr('fill', 'none');
    svgS.append('line')
      .attr('x1', chartWidth - (margin))
      .attr('x2', chartWidth - (margin))
      .attr('y1', chartHeight - vMargin)
      .attr('y2', chartHeight - vMargin + 10)
      .attr('stroke', colors.NEUTRAL)
      .attr('fill', 'none');
    svgS.append('text')
      .attr('x', chartWidth - (margin))
      .attr('y', chartHeight - vMargin + 20)
      .attr('class', 'axis-label')
      .attr('text-anchor', 'end')
      .attr('alignment-baseline', 'top')
      .text('2019');
    svgS.append('text')
      .attr('x', margin)
      .attr('y', chartHeight - vMargin + 20)
      .attr('class', 'axis-label')
      .attr('text-anchor', 'start')
      .attr('alignment-baseline', 'top')
      .text('2007');
    svgS.append('text')
      .attr('x', chartWidth / 2)
      .attr('y', chartHeight - vMargin + 20)
      .attr('class', 'axis-label')
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'top')
      .text('← Anni →');

    const min = smallMultiples[c][0];
    const max = smallMultiples[c][smallMultiples[c].length - 1];
    let string = (min < max) ? `+${formatNumber(Math.round(max / min))}×` : `-${formatNumber(Math.round(min / max))}×`;
    if (string === '-1×' || string === '+1×') {
      string = '';
    } else if (string === '+Infinity×') {
      string = '';
    }
    const ypos = (Math.abs(scaleY(min) - scaleY(max)) > 15) ? scaleY(d3.mean([min, max])) : scaleY(d3.mean([min, max])) - 15;
    svgS.append('line')
      .attr('x1', (margin))
      .attr('x2', chartWidth - (margin))
      .attr('y1', scaleY(min))
      .attr('y2', scaleY(min))
      .attr('stroke', colors.NEUTRAL)
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '1 1')
      .attr('fill', 'none');

    svgS.append('line')
      .attr('x1', (margin))
      .attr('x2', chartWidth - (margin))
      .attr('y1', scaleY(max))
      .attr('y2', scaleY(max))
      .attr('stroke', colors.NEUTRAL)
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '2 1')
      .attr('fill', 'none');

      svgS.append('line')
        .attr('x1', (margin))
        .attr('x2', chartWidth - (margin))
        .attr('y1', scaleY(maxMax))
        .attr('y2', scaleY(maxMax))
        .attr('stroke', colors.NEUTRAL)
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '2 4 1 4')
        .attr('fill', 'none');

      svgS.append('text')
        .attr('x', margin)
        .attr('dx', -5)
        .attr('y', scaleY(maxMax))
        .attr('class', 'numbers')
        .attr('text-anchor', 'end')
        .attr('alignment-baseline', 'middle')
        .text(formatNumber(maxMax));

    svgS.append('path')
      .attr('d', area(data))
      .attr('class', `sm-area sm-area-${c}`)
      .attr('id', `sm-area-${c}`)
      .attr('stroke', 'none')
      .attr('fill', 'url(#fill)');

    svgS.append('path')
      .attr('d', line(data))
      .attr('class', `sm-line sm-line-${c}`)
      .attr('id', `sm-line-${c}`)
      .attr('stroke', colors[c])
      .attr('stroke-width', 2)
      .attr('fill', 'none');

    svgS.append('text')
      .attr('x', chartWidth / 2)
      .attr('y', ypos)
      .attr('class', 'annotation')
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .text(string);

    svgS.append('text')
      .attr('x', data[0].x)
      .attr('y', data[0].y)
      .attr('dx', -5)
      .attr('class', 'numbers')
      .attr('text-anchor', 'end')
      .attr('alignment-baseline', 'middle')
      .text(formatNumber(smallMultiples[c][0]));

    svgS.append('text')
      .attr('x', data[0].x)
      .attr('y', data[0].y)
      .attr('class', 'numbers')
      .attr('text-anchor', 'start')
      .attr('alignment-baseline', 'middle')
      .text('🚘');

    svgS.append('text')
      .attr('x', data[data.length - 1].x)
      .attr('dx', 5)
      .attr('y', data[data.length - 1].y)
      .attr('class', 'numbers')
      .attr('text-anchor', 'start')
      .attr('alignment-baseline', 'middle')
      .text(formatNumber(smallMultiples[c][smallMultiples[c].length - 1]));

  });
};
