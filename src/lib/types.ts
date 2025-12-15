export interface GeoResponse {
  success: boolean;
  location: {
    ip: string;
    country: string;
    region: string;
    city: string;
    latitude: number;
    longitude: number;
    postalCode: string;
    timezone: string;
  };
}
