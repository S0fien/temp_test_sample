import { eventInfo, interval } from "../interfaces";
import {
  hourMinutestoMinutes,
  collision,
  getCollisionIntervals,
} from "../helper";

export default function CalenderElement({
  eventList,
  calenderDurationInMinutes,
  grow,
  marginTop,
}: {
  eventList: eventInfo[];
  calenderDurationInMinutes: number;
  grow?: number;
  marginTop?: number;
}) {
  let groupedEventLists: eventInfo[][] = [];
  const eventInfoList: eventInfo[] = eventList.map((eventElement) => {
    const startInMinutes = hourMinutestoMinutes(eventElement.start);
    const endInMinutes = startInMinutes + eventElement.duration;

    return {
      ...eventElement,
      startInMinutes,
      endInMinutes,
    };
  });

  eventInfoList.forEach((eventA, indexA) => {
    groupedEventLists[indexA] = [eventA];
    eventInfoList.forEach((eventB, indexB) => {
      if (indexA !== indexB && collision(eventA, eventB)) {
        groupedEventLists[indexA].push(eventB);
      }
    });
  });

  let indextoFiler: number[] = [];

  groupedEventLists.forEach((groupA, indexGroupA) => {
    groupedEventLists.forEach((groupB, indexGroupB) => {
      if (indexGroupA < indexGroupB) {
        if (
          groupA.every((eventInfoFromA) =>
            groupB.find(
              (eventInfoFromB: eventInfo) =>
                eventInfoFromA.id === eventInfoFromB.id
            )
          ) &&
          groupA.length <= groupB.length
        ) {
          if (!indextoFiler.find((filterIndex) => indexGroupA === filterIndex))
            indextoFiler.push(indexGroupA);
        } else if (
          groupB.every((eventInfoFromB) =>
            groupA.find(
              (eventInfoFromA: eventInfo) =>
                eventInfoFromA.id === eventInfoFromB.id
            )
          ) &&
          groupA.length > groupB.length
        ) {
          if (!indextoFiler.find((filterIndex) => indexGroupB === filterIndex))
            indextoFiler.push(indexGroupB);
        }
      }
    });
  });

  let eventsGroups: eventInfo[][] = [];

  groupedEventLists.forEach((eventGroup, indexEventGroup) => {
    if (indextoFiler.find((index) => index === indexEventGroup) === undefined) {
      eventsGroups.push(eventGroup);
    }
  });

  const getMaxCollision = (eventList: eventInfo[]): number => {
    let result = 0;
    const intervalsList: interval[] = eventList.map((eventInfoElement) => {
      const events = [eventInfoElement];
      return {
        startInMinutes: eventInfoElement.startInMinutes,
        endInMinutes: eventInfoElement.endInMinutes,
        events,
      };
    });
    let intervalsList2 = [...getCollisionIntervals(intervalsList)];

    while (intervalsList2.length) {
      result++;
      intervalsList2 = [...getCollisionIntervals(intervalsList2)];
    }
    return result;
  };

  const getFirstEventTimeFromGroup = (eventGroup: eventInfo[]): number =>
    eventGroup.reduce((min, event) => {
      if (event.startInMinutes < min) {
        return event.startInMinutes;
      } else {
        return min;
      }
    }, 24 * 60);
  const calenderStartInMinutes = getFirstEventTimeFromGroup(eventInfoList);
  return (
    <div
      style={{
        flexGrow: grow ? grow + 1 : 1,
        marginTop: marginTop + "vh",
        position: "relative",
      }}
    >
      {eventsGroups.map((eventGroup, indexGroup) => {
        if (eventGroup.length === 1) {
          return (
            <div
              key={eventGroup[0].id}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                backgroundColor: "#e9caca",
                border: "solid 1px #000000",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                top:
                  ((eventGroup[0].startInMinutes - calenderStartInMinutes) /
                    calenderDurationInMinutes) *
                    100 +
                  "vh",
                height:
                  (eventGroup[0].duration / calenderDurationInMinutes) * 100 +
                  "vh",
              }}
              id={eventGroup[0].id + ""}
            >
              {eventGroup[0].id}
            </div>
          );
        } else {
          let eventGroupForchild = [...eventGroup];
          let firstChild = eventGroupForchild.shift()!;
          return (
            <div
              key={indexGroup}
              style={{
                display: "flex",
                position: "absolute",
                left: 0,
                right: 0,
                top:
                  ((getFirstEventTimeFromGroup(eventGroup) -
                    calenderStartInMinutes) /
                    calenderDurationInMinutes) *
                    100 +
                  "vh",
              }}
            >
              <div
                style={{
                  border: "solid 1px #000000",
                  backgroundColor: "#e9caca",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexGrow: 1,
                  marginTop:
                    ((firstChild.startInMinutes -
                      getFirstEventTimeFromGroup(eventGroup)) /
                      calenderDurationInMinutes) *
                      100 +
                    "vh",
                  height:
                    (firstChild.duration / calenderDurationInMinutes) * 100 +
                    "vh",
                }}
                id={firstChild.id + ""}
              >
                {firstChild.id}
              </div>

              <CalenderElement
                marginTop={
                  ((getFirstEventTimeFromGroup(eventGroupForchild) -
                    getFirstEventTimeFromGroup(eventGroup)) /
                    calenderDurationInMinutes) *
                  100
                }
                grow={getMaxCollision(eventGroupForchild)}
                eventList={eventGroupForchild}
                calenderDurationInMinutes={calenderDurationInMinutes}
              />
            </div>
          );
        }
      })}
    </div>
  );
}
