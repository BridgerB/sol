<script lang="ts">
  import "the-new-css-reset/css/reset.css";
  import { onMount } from "svelte";
  import { sol } from "@bridgerb/sol";
  import { SunDial } from "$lib";
  import type { GeoResponse } from "$lib";

  let lat = $state(36.123589);
  let lng = $state(-121.638383);
  let city = $state("");
  let region = $state("");
  let error = $state("");
  let loading = $state(true);

  let helpMode = $state(false);
  let isSliding = $state(false);
  let sliderValue = $state(0);
  let now = $state(new Date());

  let locationInfo = $derived(city && region ? `${city}, ${region}` : "");

  let solResult = $derived(
    lat && lng ? sol({ date: now, latitude: lat, longitude: lng }) : null,
  );

  let period = $derived(solResult?.period === "day" ? "d" : "n");

  let solTime = $derived.by(() => {
    if (isSliding) {
      const p = sliderValue < 100 ? "d" : "n";
      const v = sliderValue < 100
        ? sliderValue
        : Math.min(sliderValue - 100, 99.999);
      return `${v.toFixed(3)}${p}`;
    }
    if (!solResult) return "⌛";
    return helpMode
      ? `${solResult.percentage.toFixed(3)}${period}`
      : `${Math.floor(solResult.percentage)}${period}`;
  });

  let ready = $derived(!loading && solTime !== "⌛");
  let solInt = $derived(solTime.slice(0, -1).split(".")[0]);
  let solDec = $derived(solTime.slice(0, -1).split(".")[1] || "0");
  let solPeriod = $derived(solTime.slice(-1) as "d" | "n");
  let solWord = $derived(solPeriod === "d" ? "day" : "night");

  $effect(() => {
    if (!isSliding && solResult) {
      sliderValue = solResult.period === "day"
        ? solResult.percentage
        : 100 + solResult.percentage;
    }
  });

  onMount(() => {
    const intervalId = setInterval(() => {
      if (!isSliding) now = new Date();
    }, 100);

    fetch("https://cloudflare-geo.bridgerb.workers.dev")
      .then((r) => r.json() as Promise<GeoResponse>)
      .then((data) => {
        if (data.success) {
          lat = data.location.latitude;
          lng = data.location.longitude;
          city = data.location.city;
          region = data.location.region;
        } else {
          error = "Failed to get location";
        }
      })
      .catch((e) => (error = e.message))
      .finally(() => (loading = false));

    return () => clearInterval(intervalId);
  });
</script>

<div class="container">
  <button
    class="help-button"
    onclick={() => {
      helpMode = !helpMode;
      isSliding = false;
    }}
    aria-label={helpMode ? "Exit help mode" : "Enter help mode"}
    aria-pressed={helpMode}
  >
    {helpMode ? "X" : "?"}
  </button>

  <p class="location-info">
    {#if helpMode}
      {#if loading}Loading...{:else if error}{error}{:else}{locationInfo}{/if}
    {/if}
  </p>

  {#if ready}
    <SunDial {solTime} {helpMode} />
  {:else}
    <div class="sundial" style="width: 240px; height: 240px"></div>
  {/if}

  {#if ready}
    <p class="sol-time">
      {#if helpMode}
        <span class="sol-time-orange">{solInt}</span>.{solDec}% of the way<br />
        through the <span class="sol-time-orange">{solWord[0]}</span>{
          solWord.slice(1)
        }
      {:else}
        {solTime}
      {/if}
    </p>
  {:else}
    <div class="sol-time" style="min-height: 1.5em"></div>
  {/if}

  <div class="help-container" class:visible={helpMode}>
    <div class="slider-wrapper">
      <input
        type="range"
        min="0"
        max="199.999"
        step="0.001"
        value={sliderValue}
        oninput={(e) => sliderValue = parseFloat(e.currentTarget.value)}
        onmousedown={() => helpMode && (isSliding = true)}
        onmouseup={() => isSliding = false}
        ontouchstart={() => helpMode && (isSliding = true)}
        ontouchend={() => isSliding = false}
        aria-label="Solar time slider"
        class="time-slider"
      />
    </div>
    <div class="help-message">
      <p><span class="sol-time-orange">d</span>ay = sunrise to sunset</p>
      <p><span class="sol-time-orange">n</span>ight = sunset to sunrise</p>
    </div>
  </div>
</div>

<style>
  .container {
    font-family: Avenir, sans-serif;
    touch-action: pan-x pan-y;
    background-color: black;
    min-height: 100vh;
    display: grid;
    grid-template-rows: 2rem 300px 80px 160px 1fr;
    grid-template-columns: 1fr;
    gap: 1rem;
    place-items: center;
    position: relative;
  }

  p {
    color: white;
    font-size: 1rem;
    margin: 0.5rem 0;
  }

  .help-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 40px;
    height: 40px;
    background-color: #444;
    color: white;
    border: 2px solid #666;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.2s;
  }

  .help-button:hover {
    background-color: #666;
    transform: scale(1.1);
  }

  .help-button:focus {
    outline: 2px solid #ccc;
    outline-offset: 2px;
  }

  .sol-time {
    cursor: pointer;
    transition: color 0.2s;
    font-size: 1.5rem;
  }

  .sol-time:hover {
    color: #ccc;
  }

  .help-container {
    grid-row: 4;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 0 2em;
    max-width: 500px;
    text-align: center;
    width: 80%;
  }

  .help-container:not(.visible) {
    display: none;
  }

  .help-message {
    color: white;
    font-size: 1rem;
  }

  .help-message p {
    font-size: 1rem;
    margin: 0.5rem 0;
  }

  .location-info {
    grid-row: 1;
    color: #999;
    font-size: 1rem;
    margin: 0;
    min-height: 1.5rem;
    width: 100%;
    text-align: center;
  }

  .sundial {
    grid-row: 2;
  }

  .time-slider {
    width: 80%;
    max-width: 400px;
    margin: 1rem auto;
    height: 8px;
    background: #666;
    border-radius: 4px;
    outline: none;
    appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
  }

  .time-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: #fff;
    border: 2px solid #444;
    border-radius: 50%;
    cursor: pointer;
    transition: background 0.2s;
  }

  .time-slider::-webkit-slider-thumb:hover {
    background: #ccc;
  }

  .time-slider::-moz-range-track {
    height: 8px;
    background: #666;
    border-radius: 4px;
  }

  .time-slider::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: #fff;
    border: 2px solid #444;
    border-radius: 50%;
    cursor: pointer;
  }

  .sol-time-orange {
    color: #ff4500;
  }

  .slider-wrapper {
    position: relative;
    width: 80%;
    max-width: 400px;
    margin: 1rem auto;
  }
</style>
