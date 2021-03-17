import get from 'lodash.get';
import set from 'lodash.set';
import setWith from 'lodash.setwith';
import mergeWith from 'lodash.mergewith';

import type { PickByValue } from 'types/helpers';
import type { RideHistoryResponse } from 'types/RideHistoryResponse';
import type {
  CountPrice,
  CountPriceObject,
  Rides,
  RidesData,
} from 'types/Rides';

import { getCarName, getTimeAndDateOfRide } from './helpers';

type CountPriceKeys = keyof PickByValue<Required<Rides>, CountPriceObject>;

const countPriceKeys: CountPriceKeys[] = [
  '_cars',
  '_days',
  '_hours',
  '_methods',
  '_months',
  '_weeks',
  '_years',
];

const mergeSumAndCount = (
  value: CountPrice | undefined,
  src: CountPrice
): CountPrice => {
  if (!value) return src;

  return {
    count: value.count + src.count,
    price: value.price + src.price,
  };
};

// TODO: Fix type :|
const mixer = (
  value: Rides[typeof key] | undefined,
  src: Required<Rides>[typeof key],
  key: keyof Rides
) => {
  if (!value) {
    return src;
  }

  if (key === '_summary') {
    return {
      count:
        (value as Rides['_summary']).count + (src as Rides['_summary']).count,
      prices:
        (value as Rides['_summary']).prices + (src as Rides['_summary']).prices,
    };
  }

  if (key === '_ranges') {
    return {
      start: (src as Rides['_ranges']).start,
      end: (value as Rides['_ranges']).end,
    };
  }

  if (key === '_points') {
    return {
      destination: (src as Rides['_points']).destination.concat(
        (value as Rides['_points']).destination
      ),
      origin: (src as Rides['_points']).origin.concat(
        (value as Rides['_points']).origin
      ),
    };
  }

  if (countPriceKeys.some((k) => k === key)) {
    return mergeWith(value, src, mergeSumAndCount);
  }
};

export const mergeReports = (newRides: RidesData, oldRides: RidesData) => {
  return mergeWith(newRides, oldRides, mixer);
};

export const getReport = (response: RideHistoryResponse[]) => {
  /* TODO: handle versioning */
  return response.reduce(
    (
      tmp: RidesData,
      {
        priceDetail: {
          passengerShareValue,
          paymentMethod: { method },
        },
        date,
        origin,
        destinations,
        driverInfo: { fullCarInfo },
      }
    ) => {
      // TODO: how to check cancelled rides?

      const { year, rideTime, ...dates } = getTimeAndDateOfRide(date);

      // calculate count of rides
      set(
        tmp,
        ['total', '_summary', 'count'],
        get(tmp, ['total', '_summary', 'count'], 0) + 1
      );
      set(
        tmp,
        [year, '_summary', 'count'],
        get(tmp, [year, '_summary', 'count'], 0) + 1
      );

      // calculate prices (Toman)
      const price = passengerShareValue;
      set(
        tmp,
        ['total', '_summary', 'prices'],
        get(tmp, ['total', '_summary', 'prices'], 0) + price
      );
      set(
        tmp,
        [year, '_summary', 'prices'],
        get(tmp, [year, '_summary', 'prices'], 0) + price
      );

      // calculate startTime
      set(tmp, ['total', '_ranges', 'start'], rideTime);
      set(tmp, [year, '_ranges', 'start'], rideTime);

      // calculate endTime
      if (get(tmp, ['total', '_ranges', 'end']) === undefined) {
        set(tmp, ['total', '_ranges', 'end'], rideTime);
      }
      if (get(tmp, [year, '_ranges', 'end']) === undefined) {
        set(tmp, [year, '_ranges', 'end'], rideTime);
      }

      // calculate cars
      const car = getCarName(fullCarInfo);
      set(
        tmp,
        ['total', '_cars', car, 'count'],
        get(tmp, ['total', '_cars', car, 'count'], 0) + 1
      );
      set(
        tmp,
        ['total', '_cars', car, 'price'],
        get(tmp, ['total', '_cars', car, 'price'], 0) + price
      );
      set(
        tmp,
        [year, '_cars', car, 'count'],
        get(tmp, [year, '_cars', car, 'count'], 0) + 1
      );
      set(
        tmp,
        [year, '_cars', car, 'price'],
        get(tmp, [year, '_cars', car, 'price'], 0) + price
      );

      // calculate methods
      set(
        tmp,
        ['total', '_methods', method, 'count'],
        get(tmp, ['total', '_methods', method, 'count'], 0) + 1
      );
      set(
        tmp,
        ['total', '_methods', method, 'price'],
        get(tmp, ['total', '_methods', method, 'price'], 0) + price
      );
      set(
        tmp,
        [year, '_methods', method, 'count'],
        get(tmp, [year, '_methods', method, 'count'], 0) + 1
      );
      set(
        tmp,
        [year, '_methods', method, 'price'],
        get(tmp, [year, '_methods', method, 'price'], 0) + price
      );

      // calculate each date range with total price
      Object.keys(dates).forEach((key) => {
        const k = `_${key}s`;
        const v = dates[key];
        setWith(
          tmp,
          ['total', k, v, 'count'],
          get(tmp, ['total', k, v, 'count'], 0) + 1,
          Object
        );
        setWith(
          tmp,
          ['total', k, v, 'price'],
          get(tmp, ['total', k, v, 'price'], 0) + price,
          Object
        );
        setWith(
          tmp,
          [year, k, v, 'count'],
          get(tmp, [year, k, v, 'count'], 0) + 1,
          Object
        );
        setWith(
          tmp,
          [year, k, v, 'price'],
          get(tmp, [year, k, v, 'price'], 0) + price,
          Object
        );
      });

      // calculate points
      if (tmp.total._points === undefined) {
        set(tmp, ['total', '_points'], { origin: [], destination: [] });
      }
      tmp.total._points.origin.push({
        lat: origin.location.latitude,
        lng: origin.location.longitude,
      });
      destinations.forEach((destination) => {
        tmp.total._points.destination.push({
          lat: destination.location.latitude,
          lng: destination.location.longitude,
        });
      });

      if (tmp[year]._points === undefined) {
        set(tmp, [year, '_points'], { origin: [], destination: [] });
      }
      tmp[year]._points.origin.push({
        lat: origin.location.latitude,
        lng: origin.location.longitude,
      });
      destinations.forEach((destination) => {
        tmp[year]._points.destination.push({
          lat: destination.location.latitude,
          lng: destination.location.longitude,
        });
      });

      return tmp;
    },
    {}
  );
};
