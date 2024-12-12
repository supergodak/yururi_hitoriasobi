export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  creator_id: string;
  created_at: string;
  updated_at: string;
}

export interface VenueOption {
  id: string;
  event_id: string;
  name: string;
  url?: string;
  created_at: string;
  updated_at: string;
}

export interface DateOption {
  id: string;
  event_id: string;
  date: string;
  start_time: string;
  end_time: string;
  created_at: string;
}

export interface Participant {
  id: string;
  event_id: string;
  user_id?: string;
  email: string;
  name?: string;
  response: 'yes' | 'no' | 'maybe' | null;
  date_option_id: string;
  venue_option_id?: string;
}

export interface InvitationToken {
  email: string;
  eventId: string;
  expires: number;
}