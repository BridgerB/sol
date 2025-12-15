import { sol } from "./index.ts";

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string): void {
  if (condition) {
    passed++;
  } else {
    failed++;
    console.error("FAIL:", message);
  }
}

function assertClose(
  actual: number,
  expected: number,
  tolerance: number,
  message: string,
): void {
  const diff = Math.abs(actual - expected);
  if (diff <= tolerance) {
    passed++;
  } else {
    failed++;
    console.error("FAIL:", message, `(expected ${expected}, got ${actual})`);
  }
}

const noon = sol({
  date: new Date("2024-06-21T12:00:00Z"),
  latitude: 0,
  longitude: 0,
});
assert(typeof noon.percentage === "number", "percentage should be a number");
assert(
  noon.period === "day" || noon.period === "night",
  "period should be day or night",
);

assertClose(
  noon.percentage,
  50,
  1,
  "solar noon at equator should be around 50%",
);
assert(noon.period === "day", "solar noon should be day");

const nadirTime = new Date("2024-06-21T00:03:00Z");
const midnight = sol({ date: nadirTime, latitude: 0, longitude: 0 });
assertClose(
  midnight.percentage,
  0,
  1,
  "solar midnight at equator should be around 0%",
);
assert(midnight.period === "night", "solar midnight should be night");

const dates = [
  new Date("2024-01-01T00:00:00Z"),
  new Date("2024-06-21T06:00:00Z"),
  new Date("2024-06-21T18:00:00Z"),
  new Date("2024-12-31T23:59:59Z"),
];
for (const d of dates) {
  const result = sol({ date: d, latitude: 40, longitude: -111 });
  assert(
    result.percentage >= 0,
    `percentage should be >= 0 for ${d.toISOString()}`,
  );
  assert(
    result.percentage < 100,
    `percentage should be < 100 for ${d.toISOString()}`,
  );
}

const northPoleSummer = sol({
  date: new Date("2024-06-21T12:00:00Z"),
  latitude: 90,
  longitude: 0,
});
assert(northPoleSummer.period === "day", "north pole summer should be day");
assert(
  !isNaN(northPoleSummer.percentage),
  "north pole summer should not return NaN",
);

const northPoleWinter = sol({
  date: new Date("2024-12-21T12:00:00Z"),
  latitude: 90,
  longitude: 0,
});
assert(northPoleWinter.period === "night", "north pole winter should be night");
assert(
  !isNaN(northPoleWinter.percentage),
  "north pole winter should not return NaN",
);

const leapYear = sol({
  date: new Date("2024-02-29T12:00:00Z"),
  latitude: 0,
  longitude: 0,
});
assert(!isNaN(leapYear.percentage), "leap year date should work");

const yearBoundary = sol({
  date: new Date("2024-12-31T23:59:59Z"),
  latitude: 0,
  longitude: 0,
});
assert(!isNaN(yearBoundary.percentage), "year boundary should work");

const epoch = sol({ date: new Date(0), latitude: 0, longitude: 0 });
assert(!isNaN(epoch.percentage), "unix epoch should work");

const tokyo = sol({
  date: new Date("2024-06-21T03:00:00Z"),
  latitude: 35.6762,
  longitude: 139.6503,
});
assert(!isNaN(tokyo.percentage), "tokyo should work");

const sydney = sol({
  date: new Date("2024-06-21T02:00:00Z"),
  latitude: -33.8688,
  longitude: 151.2093,
});
assert(!isNaN(sydney.percentage), "sydney should work");

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
