export interface CreateHomeOwnerAddressRequestDTO {
  site_name: string;

  contact_name: string;

  family_name?: string;

  phone_no?: string;

  country_code?: string;

  postal_address?: string;

  location: [number, number];
}
