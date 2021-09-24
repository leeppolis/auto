const pollution = (svgW, years, inquinamento) => {
  const charts = [
    {
      limit: 40,
      limitLabel: '40µg/m³ (*)',
      title: '<span style="color:#9D4E7A">PM10</span> e <span style="color: #5C9AA0;">Diossido di Azoto (NO2)</span> Medio<br /><em>(*) Limite di legge del valore medio annuo</em>',
      unit: 'µg/m³',
      series: [
        {
          id: 'no2',
          label: 'NO2',
          path: [ 'NO2', 'avg' ],
          color: '#5C9AA0'
        },
        {
          id: 'pm10',
          label: 'PM10',
          path: [ 'PM10', 'avg' ],
          color: '#9D4E7A'
        }
      ]
    },
    {
      title: '<span style="color:#9D4E7A">PM10</span> (limite picco giornaliero 50µg/m³) e <span style="color: #6AAB9E;">Ozono (O3)</span> (limite 120 µg/m3):<br />giorni oltre i limiti di legge',
      unit: 'giorni',
      series: [
        {
          id: 'pm10d',
          label: 'PM10',
          icon: '☁️',
          path: [ 'PM10', 'days' ],
          color: '#9D4E7A'
        },
        {
          id: 'o3',
          label: 'O3',
          path: [ 'O3', 'days' ],
          color: '#6AAB9E'
        }
      ]
    }
  ];

  const pollution = d3.select('#pollution');

  charts.forEach((chart, n) => {
    const chartContainer = pollution.append('div')
      .attr('class', 'chart-container')
      .attr('id', chart.id);

    const svg = chartContainer.append('svg')
      .attr('width', svgW)
      .attr('height', pollutionChartHeight)
      .attr('viewbox', `0 0 ${svgW} ${pollutionChartHeight}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');
    
    chartContainer.append('div')
      .attr('class', 'chart-title')
      .html(chart.title);

    const gL = svg.append('g');
    const gP = svg.append('g');
    const gT = svg.append('g');
    const gC = svg.append('g');
    const chartData = [[], []];
      
    chart.series.forEach((serie, l) => {
      years.forEach((y,i) => {
        chartData[l].push({
          x: getXPos(i),
          y: inquinamento[y][serie.path[0]][serie.path[1]] !== 'n.a.' ? inquinamento[y][serie.path[0]][serie.path[1]] : 0,
          year: y,
        });
      });
    });

    years.forEach((y, i) => {
      gL.append('text')
        .attr('x', getXPos(i))
        .attr('y', pollutionChartHeight - 40)
        .attr('dy', 20)
        .attr('class','pollution-axis-label')
        .text(y);
    });
    
    let max = Math.max(d3.max(chartData[0], d => d.y), d3.max(chartData[1], d => d.y));
    const maxMax = max;
    if (chart.unit === 'giorni') {
      max = 150;
    }
    const yScale = d3.scaleLinear()
      .domain([ 0, max ])
      .range([pollutionChartHeight - 40, 20]);
    let path = [ [`M${getXPos(0)} ${yScale(chartData[0][0].y)}`], [`M${getXPos(0)} ${yScale(chartData[1][0].y)}`] ];

    chartData.forEach((serie, m) => {
      serie.forEach((d, i) => {
        const y = d.y !== 0 ? yScale(d.y) : yScale(0);
        gC.append('circle')
          .attr('class', `pollution-circle pollution-circle-${chart.series[m].id} ${(d.y !== 0) ? '' : 'shadow'}`)
          .attr('cx', d.x)
          .attr('cy', y)
          .attr('r', 5)
          .attr('stroke', chart.series[m].color)
          .attr('fill', colors.EMPTY)
          .attr('data-year', d.year)
          .on('mouseenter', selectYear)
          .on('mouseleave', deselectYear);
        
        gC.append('text')
          .attr('x', d.x)
          .attr('y', y)
          .attr('dy', (m === 0 || d.y === 0) ? -8 : 17)
          .attr('class', `pollution-annotation pollution-annotation-${n}-${m} ${d.y === 0 ? 'pollution-annotation-na' : ''} ${i === 0 ? 'first' : ''}`)
          .attr('data-year', d.year)
          .attr('text-anchor', i === 0 ? 'end' : 'middle')
          .text(`${i === 0 ? chart.series[m].label : ''} ${(d.y === 0) ? 'N.A.' : (chart.unit === 'giorni') ? formatNumber(d.y) : formatFloat(d.y)} ${chart.unit}`);

        gP.append('line')
          .attr('x1', d.x)
          .attr('x2', d.x)
          .attr('y1', pollutionChartHeight - 40)
          .attr('y2', y)
          .attr('stroke', chart.series[m].color)
          .attr('class', `pollution-line-guide pollution-line-${n}-${m} ${(d.y !== 0) ? '' : 'shadow'}`);
        path[m].push(`L${d.x} ${y}`);
      });
      gT.append('path')
        .attr('d', path[0].join(','))
        .attr('stroke', chart.series[0].color)
        .attr('class', 'pollution-line');
      gT.append('path')
        .attr('d', path[1].join(','))
        .attr('stroke', chart.series[1].color)
        .attr('class', 'pollution-line');

      if (chart.limit) {
        gT.append('line')
          .attr('x1', getXPos(0))
          .attr('x2', getXPos(years.length - 1))
          .attr('y1', yScale(chart.limit))
          .attr('y2', yScale(chart.limit))
          .attr('class', 'pollution-limit');
          gT.append('text')
            .attr('x', getXPos(years.length))
            .attr('y', yScale(chart.limit))
            .attr('class', 'pollution-annotation pollution-annotation-limit')
            .text(`${chart.limitLabel}`);
      }
    });
  });
};
