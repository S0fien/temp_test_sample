import { eventInfo, interval } from "./interfaces";

export const getFirstHour = (eventList: eventInfo[]): number => {
  return parseInt(
    eventList
      .reduce((min, event) => {
        if (event.start < min) {
          return event.start;
        } else {
          return min;
        }
      }, "23:59")
      .slice(0, 2)
  );
};

export const getLastHour = (eventList: eventInfo[]): number => {
  return eventList.reduce((max, event) => {
    const [eventStartHour, EventStartMinute] = event.start.split(":");
    const eventEnd =
      parseInt(eventStartHour) +
      Math.ceil((event.duration + parseInt(EventStartMinute)) / 60);
    if (eventEnd > max) {
      return eventEnd;
    } else {
      return max;
    }
  }, 0);
};

export const hourMinutestoMinutes = (time: string): number => {
  const [eventStartHour, EventStartMinute] = time.split(":");
  return parseInt(eventStartHour) * 60 + parseInt(EventStartMinute);
};

export const collision = (eventA: eventInfo, eventB: eventInfo): boolean => {
  const start = Math.max(eventA.startInMinutes, eventB.startInMinutes);
  const end = Math.min(eventA.endInMinutes, eventB.endInMinutes);
  return start < end;
};

export const getCollisionIntervals = (intervals: interval[]): interval[] => {
  let result: interval[] = [];
  if (intervals.length < 2) return [];
  for (
    let indexIntervalA = 0;
    indexIntervalA <= intervals.length - 2;
    indexIntervalA++
  ) {
    for (
      let indexIntervalB = indexIntervalA + 1;
      indexIntervalB <= intervals.length - 1;
      indexIntervalB++
    ) {
      let start = Math.max(
        intervals[indexIntervalA].startInMinutes,
        intervals[indexIntervalB].startInMinutes
      );
      let end = Math.min(
        intervals[indexIntervalA].endInMinutes,
        intervals[indexIntervalB].endInMinutes
      );
      if (start < end) {
        result.push({ startInMinutes: start, endInMinutes: end });
      }
    }
  }
  result = result.filter(
    (value, index, self) =>
      index ===
      self.findIndex(
        (t) =>
          t.startInMinutes === value.startInMinutes &&
          t.endInMinutes === value.endInMinutes
      )
  );
  return result;
};
