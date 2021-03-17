import type { PaymentMethod } from './RideHistoryResponse';

export type CountPrice = {
  count: number;
  price: number;
};

export type CountPriceObject<T extends string = string> = {
  [name in T]: CountPrice;
};

export type RidesInfo = keyof Rides['_summary'];

export type Coordinate = {
  lat: string | number;
  lng: string | number;
};

export type LocationPoint = {
  destination: Coordinate[];
  origin: Coordinate[];
};

export type Rides = {
  _summary: {
    count: number;
    prices: number; // Tomans
  };
  _ranges: {
    start: string; // start time
    end: string; // end time
  };
  _cars: CountPriceObject;
  _days: CountPriceObject;
  _hours: CountPriceObject;
  _months: CountPriceObject;
  _methods: CountPriceObject<PaymentMethod>;
  _points: LocationPoint;
  _weeks: CountPriceObject;
  _years?: CountPriceObject;
};

export type RidesData = { [year: string]: Rides };
