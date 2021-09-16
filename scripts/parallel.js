

// Select Category
const selectCategory = (c, container) => {
  SELECTED = c;
  container.attr('data-selected', c);
};

const parallel = (svgW, svgH, notesH, legendH, years, categories, data) => {

  console.log(years);

  const connectors = {};
  categories.forEach((c) => { connectors[c] = [] });
  const maxValue = 277675;
  document.querySelector('#parallel').innerHTML = '';
  const container = d3.select('#parallel');
  const svgP = container.append('svg')
    .attr('width', svgW)
    .attr('height', svgH)
    .attr('viewbox', `0 0 ${svgW} ${svgH}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');

  // Connectors Container needs to stay below everything
  const gCC = svgP.append('g')
    .attr('class', 'connectors');
  
  // Row / Column Header
  const gRH = svgP.append('g')
    .attr('class', 'headers row-headers');
  categories.forEach((c, i) => {
    gRH.append('text')
      .attr('x', columnWidth)
      .attr('dx', -15)
      .attr('y', ((i + 1) * rowHeight) + (rowHeight / 2) + notesH)
      .attr('class', `header row-header ${c === SELECTED ? 'selected' : ''}`)
      .attr('id', `row-header-${c}`)
      .attr('data-category', `cat-${c}`)
      .text(dictionary[c])
      .on('click', () => { selectCategory(c, container); });
    gRH.append('circle')
      .attr('cx', columnWidth - 5)
      .attr('cy', ((i + 1) * rowHeight) + (rowHeight / 2) + notesH)
      .attr('r', 3)
      .attr('fill', colors[c]);
  });

  const gCH = svgP.append('g')
    .attr('class', 'headers columns-headers');
  years.forEach((c, i) => {
    gCH.append('text')
      .attr('x', getXPos(i))
      .attr('y', rowHeight / 2 + notesH)
      .attr('class', 'header column-header')
      .attr('id', `column-header-${c}`)
      .attr('data-category', `year-${c}`)
      .text(c);
  });

  // Years
  years.forEach((y, i) => {
    const barSources = data.auto[y].sort((a, b) => b.numero - a.numero);
    const xPos = getXPos(i);
    const gYB = svgP.append('g')
      .attr('class', `year year-${y}`);
    
    barSources.forEach((b,l) => {
      const width = (b.numero > 0) ? getWidth(b.numero, maxValue) : 2;
      gYB.append('rect')
        .attr('x', xPos)
        .attr('y', getYPos(l, b.classe === SELECTED) + notesH)
        .attr('width', width)
        .attr('height', b.classe === SELECTED ? selectedBarHeight : barHeight)
        .attr('data-category', `cat-${b.classe}`)
        .attr('transform',`translate(-${Math.round(width / 2)})`)
        .attr('stroke-width', 1)
        .attr('stroke', colors[b.classe])
        .attr('fill', `url('#fill')`)
        .attr('class', `bar bar-year-${y} bar-cat-${b.classe} ${(b.numero > 0) ? '' : 'bar-cat-shadow'} ${b.classe === SELECTED ? 'selected' : ''}`)
        .style('cursor', 'pointer')
        .on('click', () => { selectCategory(b.classe, container); });;
      gYB.append('text')
        .attr('x', xPos)
        .attr('y', getYPos(l, false) + notesH)
        .attr('dy', -4)
        .attr('data-category', `cat-${b.classe}`)
        .attr('class', `bar-label bar-label-${b.classe} bar-label-${y}`)
        .text(`${formatNumber(b.numero)} ${y === '2007' ? ' 🚘' : ''}`);
      connectors[b.classe].push(getExtremes(width, l, i));
    });
  });

  // Connectors
  categories.forEach((c) => {
    const gCCS = gCC.append('g')
      .attr('class', `connector connector-${c}`)
      .attr('data-category', `cat-${c}`);
    connectors[c].forEach((d, i) => {
      if (i > 0) {
        gCCS.append('line')
          .attr('x1', connectors[c][i -1][1][0])
          .attr('y1', connectors[c][i -1][1][1] + notesH)
          .attr('x2', d[0][0])
          .attr('y2', d[0][1] + notesH)
          .attr('stroke', colors[c])
          .attr('class', `connector ${c === SELECTED ? 'selected' : ''}`);
      } else {
        gCCS.append('line')
          .attr('x1', columnWidth)
          .attr('y1', d[0][1] + notesH)
          .attr('x2', d[0][0])
          .attr('y2', d[0][1] + notesH)
          .attr('stroke', colors[c])
          .attr('class', `connector ${c === SELECTED ? 'selected' : ''}`);
      }
    });
    gCCS.append('line')
      .attr('x1', svgW - columnWidth)
      .attr('y1', connectors[c][connectors[c].length - 1][1][1] + notesH)
      .attr('x2', connectors[c][connectors[c].length - 1][1][0])
      .attr('y2', connectors[c][connectors[c].length - 1][1][1] + notesH)
      .attr('stroke', colors[c])
      .attr('class', `connector ${c === SELECTED ? 'selected' : ''}`);
  });

  // Summaries
  const gSY = svgP.append('g')
    .attr('class', 'summary-categories');
  const lastYear = data.auto[years[years.length - 1]].sort((a, b) => b.numero - a.numero);
  lastYear.forEach((y, i) => {
    gSY.append('text')
      .attr('x', svgW - columnWidth)
      .attr('dx', 15)
      .attr('y', ((i + 1) * rowHeight) + (rowHeight / 2) + notesH)
      .attr('data-category', `cat-${y.classe}`)
      .attr('class', `summary summary-category`)
      .text(`${dictionary[y.classe]}`)
      .on('click', () => { selectCategory(y.classe, container); });
    gRH.append('circle')
      .attr('cx', svgW - columnWidth + 5)
      .attr('cy', ((i + 1) * rowHeight) + (rowHeight / 2) + notesH)
      .attr('r', 3)
      .attr('fill', colors[y.classe]);
  });

  // Annotations
  const gA = svgP.append('g')
    .attr('class', 'parallel-annotations');
  ANNOTATIONS.forEach((A) => {
    const i = years.findIndex(d => d === A.year);
    const xPos = getXPos(i);
    const baseYPos = notesH;
    console.log(xPos);

    gA.append('line')
      .attr('x1', xPos)
      .attr('x2', xPos)
      .attr('y1', baseYPos)
      .attr('y2', baseYPos - 20)
      .attr('stroke-width', 1)
      .attr('class', 'parallel-annotation-line');

    gA.append('circle')
      .attr('cx', xPos)
      .attr('cy', baseYPos - 20)
      .attr('r', 9)
      .attr('class', `parallel-annotation-circle parallel-annotation-circle-3 ${A.circle > 2 ? 'selected' : ''}`);

    gA.append('circle')
      .attr('cx', xPos)
      .attr('cy', baseYPos - 20)
      .attr('r', 6)
      .attr('class', `parallel-annotation-circle parallel-annotation-circle-2 ${A.circle > 1 ? 'selected' : ''}`);

    gA.append('circle')
      .attr('cx', xPos)
      .attr('cy', baseYPos - 20)
      .attr('r', 3)
      .attr('class', `parallel-annotation-circle parallel-annotation-circle-1 ${A.circle > 0 ? 'selected' : ''}`);

    gA.append('text')
      .attr('x', xPos)
      .attr('y', baseYPos - 80)
      .attr('class', `parallel-annotation-title parallel-annotation-title-${A.year}`)
      .text(`Introduzione ${A.title}`);

    gA.append('text')
      .attr('x', xPos)
      .attr('y', baseYPos - 60)
      .attr('class', `parallel-annotation-text parallel-annotation-text-${A.year}`)
      .text(A.text1);

    gA.append('text')
      .attr('x', xPos)
      .attr('y', baseYPos - 40)
      .attr('class', `parallel-annotation-text parallel-annotation-text-${A.year}`)
      .text(A.text2);

    // Legend
    const legendYPos = svgH - 10;
    const legendXStart = 203;
    const gL = svgP.append('g')
      .attr('class', 'parallel-legend');

      gA.append('circle')
        .attr('cx', legendXStart)
        .attr('cy', legendYPos)
        .attr('r', 9)
        .attr('class', `parallel-annotation-circle parallel-annotation-circle-3`);
  
      gA.append('circle')
        .attr('cx', legendXStart)
        .attr('cy', legendYPos)
        .attr('r', 6)
        .attr('class', `parallel-annotation-circle parallel-annotation-circle-2`);
  
      gA.append('circle')
        .attr('cx', legendXStart)
        .attr('cy', legendYPos)
        .attr('r', 3)
        .attr('class', `parallel-annotation-circle parallel-annotation-circle-1 selected`);

      gA.append('text')
        .attr('x', legendXStart)
        .attr('y', legendYPos)
        .attr('dx', 12)
        .attr('class', `parallel-legend`)
        .text('Efficace nella cerchia dei Navigli');





      gA.append('circle')
        .attr('cx', legendXStart + 300)
        .attr('cy', legendYPos)
        .attr('r', 9)
        .attr('class', `parallel-annotation-circle parallel-annotation-circle-3 selected`);
  
      gA.append('circle')
        .attr('cx', legendXStart + 300)
        .attr('cy', legendYPos)
        .attr('r', 6)
        .attr('class', `parallel-annotation-circle parallel-annotation-circle-2 selected`);
  
      gA.append('circle')
        .attr('cx', legendXStart + 300)
        .attr('cy', legendYPos)
        .attr('r', 3)
        .attr('class', `parallel-annotation-circle parallel-annotation-circle-1 selected`);

      gA.append('text')
        .attr('x', legendXStart + 300)
        .attr('y', legendYPos)
        .attr('dx', 12)
        .attr('class', `parallel-legend`)
        .text('Efficace su tutto il territorio comunale');

      gA.append('line')
        .attr('x1', legendXStart + 600)
        .attr('x2', legendXStart + 650)
        .attr('y1', legendYPos)
        .attr('y2', legendYPos)
        .attr('class', `parallel-legend-line`)

      gA.append('text')
        .attr('x', legendXStart + 650)
        .attr('y', legendYPos)
        .attr('dx', 3)
        .attr('class', `parallel-legend`)
        .text('Variazione nel tempo');

  });
};
