const pollution = (svgW, years, inquinamento) => {
  const charts = [
    {
      id: 'pm10',
      title: 'PM10 Medio (limite di legge della media annuale: 40µg/m³)',
      icon: '😶‍🌫️',
      unit: 'µg/m³',
      path: [ 'PM10', 'avg' ]
    },
    {
      id: 'pm10d',
      title: 'PM10: giorni oltre i limi di legge (limite di legge picco giornaliero: 50µg/m³)',
      icon: '☁️',
      unit: 'giorni',
      path: [ 'PM10', 'days' ]
    },
    {
      id: 'no2',
      title: 'NO2 Medio (limite di legge della media annuale: 40 µg/m³)',
      icon: '💨',
      unit: 'µg/m³',
      path: [ 'NO2', 'avg' ]
    },
    {
      id: 'o3',
      title: 'O3: giorni oltre i limiti di legge (limite di legge picco giornaliero: 120 µg/m3)',
      icon: '😷',
      unit: 'giorni',
      path: [ 'O3', 'days' ]
    }
  ];

  const pollution = d3.select('#pollution');

  charts.forEach((chart, i) => {
    const chartContainer = pollution.append('div')
      .attr('class', 'chart-container')
      .attr('id', chart.id);

    const svg = chartContainer.append('svg')
      .attr('width', svgW)
      .attr('height', pollutionChartHeight)
      .attr('viewbox', `0 0 ${svgW} 200`)
      .attr('preserveAspectRatio', 'xMidYMid meet');
    
    chartContainer.append('div')
      .attr('class', 'chart-title')
      .text(chart.title);

    const gL = svg.append('g');
    const gP = svg.append('g');
    const gT = svg.append('g');
    const gC = svg.append('g');
    const chartData = [];
    years.forEach((y,i) => {
      const x = getXPos(i);
      chartData.push({
        x,
        y: inquinamento[y][chart.path[0]][chart.path[1]] !== 'n.a.' ? inquinamento[y][chart.path[0]][chart.path[1]] : 0,
        year: y,
      });
      gL.append('text')
        .attr('x', x)
        .attr('y', pollutionChartHeight - 20)
        .attr('dy', 20)
        .attr('class','pollution-axis-label')
        .text(y);
    });
    let max = d3.max(chartData, d => d.y);
    const maxMax = max;
    if (chart.unit === 'giorni') {
      max = 365;
    }
    const yScale = d3.scaleLinear()
      .domain([ 0, max ])
      .range([pollutionChartHeight - 40, 20]);
    let path = [`M${getXPos(0)} ${yScale(chartData[0].y)}`];
    chartData.forEach((d, l) => {
      const y = d.y !== 0 ? yScale(d.y) : yScale(max);
      gC.append('circle')
        .attr('class', `pollution-circle pollution-circle-${chart.id} ${(d.y !== 0) ? '' : 'shadow'}`)
        .attr('cx', d.x)
        .attr('cy', y)
        .attr('r', 5)
        .attr('stroke', colors.DEFAULT)
        .attr('fill', colors.EMPTY);
      
      gC.append('text')
        .attr('x', d.x)
        .attr('y', y)
        .attr('dy', -8)
        .attr('class', 'pollution-annotation')
        .text(`${(d.y === 0) ? 'N.A.' : (chart.unit === 'giorni') ? formatNumber(d.y) : formatFloat(d.y)} ${(l === 0) ? chart.unit : ''}`);
      
      gP.append('line')
        .attr('x1', d.x)
        .attr('x2', d.x)
        .attr('y1', lineChartHeight - 20)
        .attr('y2', y)
        .attr('stroke', colors.DEFAULT)
        .attr('class', `pollution-line-guide pollution-line-${chart.id} ${(d.y !== 0) ? '' : 'shadow'}`);
      path.push(`L${d.x} ${y}`);
    });
    gT.append('path')
      .attr('d', path.join(','))
      .attr('stroke', colors.NEUTRAL)
      .attr('class', 'pollution-line');
  });
};
