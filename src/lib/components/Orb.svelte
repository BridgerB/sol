<script lang="ts">
  let { period = "d", value = 0 }: { period: "d" | "n"; value: number } =
    $props();

  function interpolateColor(
    color1: string,
    color2: string,
    factor: number,
  ): string {
    const r1 = parseInt(color1.slice(1, 3), 16);
    const g1 = parseInt(color1.slice(3, 5), 16);
    const b1 = parseInt(color1.slice(5, 7), 16);
    const r2 = parseInt(color2.slice(1, 3), 16);
    const g2 = parseInt(color2.slice(3, 5), 16);
    const b2 = parseInt(color2.slice(5, 7), 16);

    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);

    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
  }

  let celestialColor = $derived(
    period === "d"
      ? interpolateColor("#FFC107", "#FF4500", Math.abs(value - 50) / 50)
      : "#E0E7FF",
  );
</script>

<circle r="10" fill={celestialColor} />
{#if period === "n"}
  <circle cx="3" cy="2" r="2" fill="#B0B7CF" />
  <circle cx="-2" cy="-3" r="1.5" fill="#B0B7CF" />
  <circle cx="1" cy="-4" r="1" fill="#B0B7CF" />
{/if}
