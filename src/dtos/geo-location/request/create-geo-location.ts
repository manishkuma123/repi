export interface GeoLocationDetailsRequestDTO {
  location_name?: string;

  location: [number, number];

  address_no?: string;

  building_name?: string;

  floor?: string;

  room_no?: string;

  alley_name?: string;

  village_name?: string;

  road_name?: string;

  subdistrict?: string;

  district?: string;

  province?: string;

  phone_no?: string;

  country_code?: string;

  note?: string;
}
