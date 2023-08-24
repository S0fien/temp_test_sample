export interface event {
  id: number;
  duration: number;
  start: string;
}

export interface eventInfo extends event {
  startInMinutes: number;
  endInMinutes: number;
}

export interface interval {
  startInMinutes: number;
  endInMinutes: number;
}
