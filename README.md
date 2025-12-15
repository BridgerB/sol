# @bridgerb/sol

Calculate solar time as a percentage of day or night.

## Install

```bash
npm install @bridgerb/sol
```

## Usage

```typescript
import { sol } from "@bridgerb/sol";

const { percentage, period } = sol({
  date: new Date(),
  latitude: 36.123589,
  longitude: -121.638383,
});

console.log(`${Math.floor(percentage)}${period[0]}`); // "42d"
```

## API

### `sol(query: SolQuery): Sol`

#### SolQuery

| Property    | Type     | Description                |
| ----------- | -------- | -------------------------- |
| `date`      | `Date`   | Date/time to calculate for |
| `latitude`  | `number` | Latitude of location       |
| `longitude` | `number` | Longitude of location      |

#### Sol

| Property     | Type               | Description                              |
| ------------ | ------------------ | ---------------------------------------- |
| `percentage` | `number`           | Progress through current period [0, 100) |
| `period`     | `"day" \| "night"` | Current period                           |

## How It Works

Solar time is calculated as a percentage through the current day or night
period:

- **Day**: Percentage from sunrise to sunset
- **Night**: Percentage from sunset to next sunrise

The percentage is always in the range [0, 100) - it can never reach 100 because
that moment is 0% of the next period.
