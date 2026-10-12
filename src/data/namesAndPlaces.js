export const CHARACTER_NAMES = [
  'John', 'Mike', 'Sarah', 'Emma', 'Liam', 'Sofia', 'Noah', 'Aisha',
  'Carlos', 'Yuki', 'Priya', 'Fatima', 'Diego', 'Chloe', 'Ravi', 'Amara', 'Mateo', 'Hana', 'Lucas'
];

export const CITIES_AND_CURRENCIES = [
  { city: 'London', currency: '£', landmark: 'Big Ben' },
  { city: 'New York', currency: '$', landmark: 'Empire State Building' },
  { city: 'Paris', currency: '€', landmark: 'Eiffel Tower' },
  { city: 'Tokyo', currency: '¥', landmark: 'Tokyo Skytree' },
  { city: 'Sydney', currency: '$', landmark: 'Opera House' },
  { city: 'Cairo', currency: 'EGP', landmark: 'Giza Pyramids' },
  { city: 'Rio de Janeiro', currency: 'R$', landmark: 'Sugarloaf Mountain' },
  { city: 'Cape Town', currency: 'R', landmark: 'Table Mountain' },
  { city: 'Mumbai', currency: '₹', landmark: 'Gateway of India' },
  { city: 'Mexico City', currency: 'pesos', landmark: 'Zócalo' },
  { city: 'Toronto', currency: '$', landmark: 'CN Tower' },
];

export const REAL_WORLD_CONTEXTS = [
  {
    type: 'taxi',
    intro: 'takes a cab through the city',
    baseText: 'a base fare of',
    rateText: 'per kilometre',
    xUnit: 'kilometres',
    yUnit: 'fare',
  },
  {
    type: 'bike_rental',
    intro: 'rents a city bicycle',
    baseText: 'an unlock fee of',
    rateText: 'per hour',
    xUnit: 'hours',
    yUnit: 'cost',
  },
  {
    type: 'drone_flight',
    intro: 'launches a mini weather drone',
    baseText: 'an initial altitude of',
    rateText: 'metres per second',
    xUnit: 'seconds',
    yUnit: 'height (metres)',
  },
  {
    type: 'phone_plan',
    intro: 'subscribes to a mobile data plan',
    baseText: 'a monthly base charge of',
    rateText: 'per gigabyte of data',
    xUnit: 'gigabytes',
    yUnit: 'bill',
  },
];
