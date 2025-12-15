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

  const yesterday = new Date(date.getTime() - 24 * 60 * 60 * 1000);
  const tomorrow = new Date(date.getTime() + 24 * 60 * 60 * 1000);

  const todayTimes = SunCalc.getTimes(date, latitude, longitude);
  const yesterdayTimes = SunCalc.getTimes(yesterday, latitude, longitude);
  const tomorrowTimes = SunCalc.getTimes(tomorrow, latitude, longitude);

  const sunrise = todayTimes.sunrise.getTime();
  const sunset = todayTimes.sunset.getTime();
  const yesterdaySunset = yesterdayTimes.sunset.getTime();
  const tomorrowSunrise = tomorrowTimes.sunrise.getTime();

  let percentage: number;
  let period: "day" | "night";

  if (time < sunrise) {
    // Night: between yesterday's sunset and today's sunrise
    percentage = ((time - yesterdaySunset) / (sunrise - yesterdaySunset)) * 100;
    period = "night";
  } else if (time < sunset) {
    // Day: between sunrise and sunset
    percentage = ((time - sunrise) / (sunset - sunrise)) * 100;
    period = "day";
  } else {
    // Night: between today's sunset and tomorrow's sunrise
    percentage = ((time - sunset) / (tomorrowSunrise - sunset)) * 100;
    period = "night";
  }

  return { percentage, period };
}
