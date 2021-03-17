import { PaymentMethod } from 'types/RideHistoryResponse';
import type { RideTimeDate } from 'types/RideTimeDate';

import { englishNumber } from 'utils/number';

const _206 = '206';
const _405 = '405';
const PARS = 'پارس';
const PEUGEOT_206 = 'پژو ۲۰۶';
const PEUGEOT_405 = 'پژو ۴۰۵';
const PEUGEOT_PARS = 'پژو پارس';
const PRIDDE = 'پراید';
const SAMAND = 'سمند';

const PRIDE_PATTERN = new RegExp(/(پراید|پرايد)/, 'i');

const matchCarName = (vehicle: string) => {
  if (PRIDE_PATTERN.test(vehicle)) {
    return PRIDDE;
  }
  if (vehicle.includes(_206)) {
    return PEUGEOT_206;
  }
  if (vehicle.includes(_405)) {
    return PEUGEOT_405;
  }
  if (vehicle.includes(PARS)) {
    return PEUGEOT_PARS;
  }
  if (vehicle.includes(SAMAND)) {
    return SAMAND;
  }
  return vehicle;
};

export const getCarName = (fullCarInfo: string) => {
  const details = fullCarInfo.split(' ');
  details.pop(); // maybe color of the car
  const car = matchCarName(details.join(' '));
  return car;
};

const options: Intl.DateTimeFormatOptions = {
  dateStyle: 'full',
  timeStyle: 'short',
  timeZone: 'Asia/Tehran',
};

export const getTimeAndDateOfRide = (rideDate: Date): RideTimeDate => {
  const persianDate = new Intl.DateTimeFormat('fa-IR', options).format(
    new Date(rideDate)
  );

  const [year, month, day, week, _, fullHour] = persianDate
    .replace(/[,،]/g, '')
    .split(' ');

  const [hour] = fullHour.split(':'); // HH:MM

  return {
    day: englishNumber(day),
    hour: Number(englishNumber(hour)),
    month,
    rideTime: `${day} ${month} ${year}`,
    week,
    year: englishNumber(year),
  };
};
