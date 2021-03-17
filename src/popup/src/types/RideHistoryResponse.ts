type Address = {
  address: string;
  shortAddress: string;
  location: {
    latitude: number;
    longitude: number;
  };
};

export type PaymentMethod = 'اعتباری' | 'نقدی';

export interface RideHistoryResponse {
  id: number;
  serviceCategory: string;
  priceDetail: {
    tripPrice: string;
    waitingTimeText: string;
    waitingTimePrice: string;
    discount: string;
    paymentMethod: {
      method: PaymentMethod;
    };
    passengerShare: string;
    toll: string;
    passengerShareValue: number;
    discountValue: number;
  };
  date: Date;
  path: string;
  origin: Address;
  destinations: Address[];
  driverInfo: {
    id: number;
    fullCarInfo: string;
    plateNumber: {
      iranText: string;
      iranNumber: string;
      plateNumber: string;
      bgColor: string;
      textColor: string;
    };
    hearingImpaired: boolean | null;
  };
}
