import eventList from "../input.json";
import { eventInfo } from "../interfaces";
import { getFirstHour, getLastHour, hourMinutestoMinutes } from "../helper";
import CalenderElement from "./calenderElement";

export default function Calender() {
  const eventInfoList: eventInfo[] = eventList.map((eventElement) => {
    const startInMinutes = hourMinutestoMinutes(eventElement.start);
    const endInMinutes = startInMinutes + eventElement.duration;

    return {
      ...eventElement,
      startInMinutes,
      endInMinutes,
    };
  });

  const firstHour = getFirstHour(eventInfoList);
  const lastHour = getLastHour(eventInfoList);
  const calenderDurationInMinutes = (lastHour - firstHour + 1) * 60;

  return (
    <div>
      <CalenderElement
        grow={1}
        marginTop={0}
        eventList={eventInfoList}
        calenderDurationInMinutes={calenderDurationInMinutes}
      />
    </div>
  );
}
