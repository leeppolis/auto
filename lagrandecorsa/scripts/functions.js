const getWidth = (value, maxValue) => {
  return Math.round(maxBarWidth * value / maxValue) || 5;
};

const getExtremes = (width, row, column) => {
  const half = (width / 2);
  const y = getYPos(row, false) + Math.round(barHeight / 2);
  return [[Math.ceil(getXPos(column) - half), y], [Math.floor(getXPos(column) + half), y]];
}

const getYPos = (line, selected = false) => {
  const bar = selected ? selectedBarHeight : barHeight;
  return (rowHeight + (line * rowHeight) + Math.round((rowHeight - bar) / 2));
};

const getXPos = column => (columnWidth + (column * columnWidth) + Math.round(columnWidth / 2));

const formatNumber = (n) => d3Locale.format(',.0f')(n);
const formatFloat = (n) => d3Locale.format(',.2f')(n);

const formatPercentage = (n) => d3Locale.format('+,.2%')(n);

const d3Locale = d3.formatLocale({
  decimal: ',',
  thousands: '.',
  grouping: [3],
  currency: ['', '€']
});
