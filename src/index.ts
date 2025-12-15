import SunCalc from "suncalc";

export interface SolQuery {
  date: Date;
  latitude: number;
  longitude: number;
}

export interface Sol {
  percentage: number;
  period: "day" | "night";
}

export function sol({ date, latitude, longitude }: SolQuery): Sol {
  const time = date.getTime();

  const times = SunCalc.getTimes(date, latitude, longitude);
  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowTimes = SunCalc.getTimes(tomorrow, latitude, longitude);
  const position = SunCalc.getPosition(date, latitude, longitude);

  const nadir = times.nadir.getTime();
  const solarNoon = times.solarNoon.getTime();
  const nextNadir = tomorrowTimes.nadir.getTime();

  const percentage = time < solarNoon
    ? ((time - nadir) / (solarNoon - nadir)) * 50
    : 50 + ((time - solarNoon) / (nextNadir - solarNoon)) * 50;

  const period = position.altitude >= 0 ? "day" : "night";

  return { percentage, period };
}
