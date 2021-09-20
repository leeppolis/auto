let SELECTED = '';
const dictionary = {
  EURO6: 'Euro 6',
  EURO5: 'Euro 5',
  EURO4: 'Euro 4',
  EURO3: 'Euro 3',
  EURO2: 'Euro 2',
  EURO1: 'Euro 1',
  EURO0: 'Euro 0',
  ANI: 'Non Ident.',
  ANC: 'Non Class.',
};
const ANNOTATIONS = [
  {
    year: '2008',
    title: 'Ecopass',
    text1: 'A pagamento per veicoli:',
    text2: 'benzina fino a Euro 2; diesel fino a Euro 3',
    circle: 1,
  },
  {
    year: '2012',
    title: 'Area C',
    text1: 'A pagamento per tutti i veicoli',
    text2: '',
    circle: 1,
  },
  {
    year: '2019',
    title: 'Area B',
    text1: 'Circolazione vietata ai veicoli:',
    text2: 'benzina fino a Euro 0, diesel fino a Euro 3',
    circle: 3,
  },
];
const colors = {
  EURO6: '#79B598',
  EURO5: '#6AAB9E',
  EURO4: '#5C9AA0',
  EURO3: '#4E7B95',
  EURO2: '#40557E',
  EURO1: '#323566',
  EURO0: '#2D254D',
  ANI: '#9D4E7A',
  ANC: '#99A89E',
  NEUTRAL: '#6F8884',
  DEFAULT: '#2F4858333',
  EMPTY: '#EDEAE3',
  HIGHLIGHT: '#EDEAE3',
  TEXT: '#2F4858',
};
const maxBarWidth = 60;
const barHeight = 8;
const selectedBarHeight = 16;
const rowHeight = 45;
const columnWidth = 80;
const lineChartHeight = 120;
const pollutionChartHeight = 120;