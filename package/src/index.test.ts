import { sol } from "./index.ts";
import assert from "node:assert/strict";

// Solar noon at equator - should be ~50% through the day
const noon = sol({
  date: new Date("2024-06-21T12:00:00Z"),
  latitude: 0,
  longitude: 0,
});
assert.strictEqual(typeof noon.percentage, "number");
assert.ok(
  Math.abs(noon.percentage - 50) <= 1,
  "solar noon should be ~50% through day",
);
assert.strictEqual(noon.period, "day");

// Midnight at equator - should be ~50% through the night
const midnight = sol({
  date: new Date("2024-06-21T00:03:00Z"),
  latitude: 0,
  longitude: 0,
});
assert.ok(
  Math.abs(midnight.percentage - 50) <= 1,
  "midnight should be ~50% through night",
);
assert.strictEqual(midnight.period, "night");

// Various dates - percentage should be 0-100
const dates = [
  new Date("2024-01-01T00:00:00Z"),
  new Date("2024-06-21T06:00:00Z"),
  new Date("2024-06-21T18:00:00Z"),
  new Date("2024-12-31T23:59:59Z"),
];
for (const d of dates) {
  const result = sol({ date: d, latitude: 40, longitude: -111 });
  assert.ok(result.percentage >= 0, `percentage >= 0 for ${d.toISOString()}`);
  assert.ok(result.percentage < 100, `percentage < 100 for ${d.toISOString()}`);
}

// Edge cases
const leapYear = sol({
  date: new Date("2024-02-29T12:00:00Z"),
  latitude: 0,
  longitude: 0,
});
assert.ok(!isNaN(leapYear.percentage), "leap year");

const yearBoundary = sol({
  date: new Date("2024-12-31T23:59:59Z"),
  latitude: 0,
  longitude: 0,
});
assert.ok(!isNaN(yearBoundary.percentage), "year boundary");

const epoch = sol({ date: new Date(0), latitude: 0, longitude: 0 });
assert.ok(!isNaN(epoch.percentage), "unix epoch");

// Different locations
const tokyo = sol({
  date: new Date("2024-06-21T03:00:00Z"),
  latitude: 35.6762,
  longitude: 139.6503,
});
assert.ok(!isNaN(tokyo.percentage), "tokyo");

const sydney = sol({
  date: new Date("2024-06-21T02:00:00Z"),
  latitude: -33.8688,
  longitude: 151.2093,
});
assert.ok(!isNaN(sydney.percentage), "sydney");

console.log("All tests passed");
