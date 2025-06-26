export interface CreateHelperEventDTO {
  name: string;
  note?: string;
  start_date: Date;
  end_date: Date;
  start_time: string; // Time as a string (e.g., 'HH:mm')
  end_time: string; // Time as a string (e.g., 'HH:mm')
  location?: string;
}
