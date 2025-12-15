# @bridgerb/sol

Calculate solar time as a percentage through the current day or night period.

## Install

```bash
npm install @bridgerb/sol
```

## Usage

```ts
import { sol } from "@bridgerb/sol";

const { percentage, period } = sol({
  date: new Date(),
  latitude: 36.123589,
  longitude: -121.638383,
});

console.log(`${percentage.toFixed(1)}% through the ${period}`);
// "45.2% through the day"
```

## API

### `sol(query: SolQuery): Sol`

#### SolQuery

- `date: Date` - The date/time to calculate for
- `latitude: number` - Latitude in degrees
- `longitude: number` - Longitude in degrees

#### Sol

- `percentage: number` - 0-100, percentage through current period
- `period: "day" | "night"` - Whether sun is above or below horizon

## License

[Unlicense](LICENSE) - Public Domain
