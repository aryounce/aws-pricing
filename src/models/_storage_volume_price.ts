import { PriceConverter, PriceDuration } from "../price_converter";

export abstract class StorageVolumePrice {
  abstract totalPrice(duration: PriceDuration): number;
}
