<script lang="ts">
  import Orb from "./Orb.svelte";

  let { solTime, helpMode }: { solTime: string; helpMode: boolean } =
    $props();

  let isDay = $derived(solTime.endsWith("d"));
  let value = $derived(parseFloat(solTime) || 0);
  let celestialAngle = $derived(
    isDay ? (value / 100) * Math.PI : Math.PI + (value / 100) * Math.PI,
  );

  // Generate markers: 0, 25, 50, 75 for day (d) and night (n)
  const markers = [0, 25, 50, 75].flatMap((n, i) => [
    { label: `${n}d`, angle: (i * Math.PI) / 4 },
    { label: `${n}n`, angle: Math.PI + (i * Math.PI) / 4 },
  ]);
</script>

<svg width="240" height="240" viewBox="-20 -20 280 280">
  <circle
    cx="120"
    cy="120"
    r="100"
    fill="none"
    stroke="#444"
    stroke-width="4"
  />
  <line x1="20" y1="120" x2="220" y2="120" stroke="#444" stroke-width="4" />

  {#if helpMode}
    {#each markers as marker (marker.label)}
      <line
        x1={120 + 96 * Math.cos(marker.angle)}
        y1={120 - 96 * Math.sin(marker.angle)}
        x2={120 + 104 * Math.cos(marker.angle)}
        y2={120 - 104 * Math.sin(marker.angle)}
        stroke="#666"
        stroke-width="2"
      />
      <text
        x={120 + 130 * Math.cos(marker.angle)}
        y={120 - 130 * Math.sin(marker.angle)}
        fill="#fff"
        font-size="16"
        text-anchor="middle"
        dominant-baseline="central"
        stroke="#000"
        stroke-width="0.6"
      >
        {marker.label}
      </text>
    {/each}
  {/if}

  <g
    transform={`translate(${120 + 100 * Math.cos(celestialAngle)}, ${
      120 - 100 * Math.sin(celestialAngle)
    })`}
  >
    <Orb {isDay} {value} />
  </g>
</svg>
