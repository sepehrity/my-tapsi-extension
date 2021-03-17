import type { BarChartTypes } from 'types/Charts';
import type { RidesInfo } from 'types/Rides';
import type { SummaryItemType } from 'types/Summary';

import { formattedNumber, getPrice } from './number';

const getRidesCount = (count: React.ReactText) => {
  return `${count} سفر`;
};

const getTypeFormat: {
  [type in BarChartTypes]: { format: (value: string) => string };
} = {
  _hours: { format: (value) => `ساعت ${value}` },
  _weeks: { format: (value) => `${value}` },
  _days: { format: (value) => `روز ${value}ام` },
  _months: { format: (value) => `${value} ماه` },
  _years: { format: (value) => `سال ${value}` },
  _methods: { format: (value) => `${value}` },
  _cars: {
    format: (value) => `ماشین ${value}`,
  },
};

const getFormattedSummary: {
  [type in RidesInfo]: {
    format: (value: number) => SummaryItemType;
  };
} = {
  count: {
    format: (value) => {
      return { description: '', message: formattedNumber(value), unit: 'سفر' };
    },
  },
  prices: {
    format: (value) => {
      return {
        description: '',
        message: getPrice(Number(value), false),
        unit: 'تومان',
      };
    },
  },
};

export const getTooltipMessage = (
  count: React.ReactText,
  price: number,
  value: string,
  type: BarChartTypes
) => {
  return `${getTypeFormat[type].format(value)} | ${getPrice(
    price
  )} (${getRidesCount(count)})`;
};

export const getSummaryItemMessage = (value: number, type: RidesInfo) => {
  return getFormattedSummary[type].format(value);
};

export const getStartAndEndDate = (start: string, end: string) =>
  `${start}   تا   ${end}`;

export const mapToPersian: { [type in BarChartTypes]: string } = {
  _hours: 'ساعت‌های شبانه‌روز',
  _weeks: 'روزهای هفته',
  _days: 'روزهای ماه',
  _months: 'ماه‌های سال',
  _years: 'سال',
  _methods: 'روش پرداخت',
  _cars: 'مدل ماشین',
};

export const getExportName: { [type in BarChartTypes]: string } = {
  _hours: 'Hours',
  _weeks: 'Weeks',
  _days: 'Days',
  _months: 'Months',
  _years: 'Years',
  _methods: 'Methods',
  _cars: 'Cars',
};

export const getErrorMessage: { [statusCode: string]: string } = {
  401: 'خیلی وقته بهم سر نزدی! باید دوباره وارد حساب تپسی بشی.',
};

export const getLastRideDateMessage = (lastEndRange: string) => {
  return `تاریخ آخرین سفر: ${lastEndRange}`;
};
