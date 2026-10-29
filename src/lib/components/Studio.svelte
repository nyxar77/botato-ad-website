<script lang="ts">
  import { ToggleGroup } from 'bits-ui';
  import { Check, ImagePlus, MousePointerClick, Plus, Type, X } from '@lucide/svelte';
  import { SPOTS, STAGE, PRICES } from '../config';
  import { quadTransform } from '../homography';
  import type { SpotId } from '../i18n';
  import { order } from '../order.svelte';
  import { settings } from '../settings.svelte';

  let cw = $state(0);
  let hover = $state<SpotId | null>(null);
  let dragging = $state(false);
  let fileInput: HTMLInputElement;

  const t = $derived(settings.t);
  const scale = $derived(cw / STAGE.w);
  const pct = (x: number, y: number) => `left:${(x / STAGE.w) * 100}%;top:${(y / STAGE.h) * 100}%`;
  const points = (pts: [number, number][]) => pts.map((p) => p.join(',')).join(' ');
  const transforms = Object.fromEntries(SPOTS.map((s) => [s.id, quadTransform(s.box[0], s.box[1], s.quad)]));

  const label = $derived(order.text.trim() || t.adHere);
  const fontSize = (box: [number, number]) => {
    const chars = Math.max(label.length, 1);
    // Allow text to scale nicely and wrap properly without overflowing the screen borders
    const targetW = (box[0] * 0.8) / Math.max(Math.min(chars, 12), 3);
    const targetH = box[1] * 0.22;
    return Math.max(16, Math.min(targetH, targetW));
  };

  function pick(e: Event) {
    const f = (e.currentTarget as HTMLInputElement).files?.[0];
    if (f) order.setImage(f);
  }
  function drop(e: DragEvent) {
    e.preventDefault();
    dragging = false;
    const f = e.dataTransfer?.files?.[0];
    if (f?.type.startsWith('image/')) order.setImage(f);
  }
  function key(e: KeyboardEvent, id: SpotId) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      order.toggle(id);
    }
  }
</script>

<section aria-labelledby="preview-title" class="flex flex-col gap-3">
  <div
    class="relative overflow-hidden rounded-2xl border border-line bg-black shadow-2xl shadow-black/30 ring-1 ring-black/5 {dragging
      ? 'ring-4 ring-accent'
      : ''}"
    style="aspect-ratio:{STAGE.w}/{STAGE.h}"
    bind:clientWidth={cw}
    dir="ltr"
    role="group"
    aria-label={t.previewTitle}
    ondragover={(e) => {
      e.preventDefault();
      dragging = true;
    }}
    ondragleave={() => (dragging = false)}
    ondrop={drop}
  >
    <!-- Stage is laid out in real photo pixels, then scaled to fit. -->
    <div
      class="absolute top-0 left-0 origin-top-left"
      style="width:{STAGE.w}px;height:{STAGE.h}px;transform:scale({scale})"
    >
      <picture>
        <source srcset="/studio.webp" type="image/webp" />
        <img
          src="/studio.jpg"
          width={STAGE.w}
          height={STAGE.h}
          alt=""
          draggable="false"
          fetchpriority="high"
          class="block size-full select-none"
        />
      </picture>

      <!-- Ad projection, masked so I stay in front of the screen. -->
      <div
        class="pointer-events-none absolute inset-0 mix-blend-multiply"
        style="mask-image:url(/screen-mask.png);-webkit-mask-image:url(/screen-mask.png);mask-size:100% 100%;-webkit-mask-size:100% 100%"
      >
        {#each SPOTS as s (s.id)}
          {@const on = order.has(s.id)}
          <div
            class="absolute top-0 left-0 grid origin-top-left place-items-center overflow-hidden bg-white transition-opacity duration-300"
            style="width:{s.box[0]}px;height:{s.box[1]}px;transform:{transforms[s.id]};opacity:{on || hover === s.id ? 1 : 0.55}"
          >
            {#if on && order.image}
              <img src={order.image} alt="" class="size-full" style="object-fit:{order.fit}" />
            {:else if on}
              <div class="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
                <span
                  dir="auto"
                  class="max-w-full leading-[1.15] font-extrabold tracking-tight break-words text-[#15141a]"
                  style="font-size:{fontSize(s.box)}px"
                >
                  {label}
                </span>
                <span class="h-2 w-16 rounded-full bg-pink"></span>
              </div>
            {:else}
              <span class="font-mono text-xl tracking-[0.3em] text-neutral-400 uppercase">{t.available}</span>
            {/if}
          </div>
        {/each}
      </div>

      <svg viewBox="0 0 {STAGE.w} {STAGE.h}" class="absolute inset-0 size-full">
        <defs>
          <mask id="spot-cutout">
            <rect width={STAGE.w} height={STAGE.h} fill="white" />
            {#each SPOTS as s (s.id)}
              <polygon
                points={points(s.outline)}
                fill="black"
                class="transition-[fill-opacity] duration-300"
                fill-opacity={order.has(s.id) || hover === s.id ? 1 : 0}
              />
            {/each}
          </mask>
        </defs>
        <rect width={STAGE.w} height={STAGE.h} fill="#05050a" fill-opacity="0.55" mask="url(#spot-cutout)" />

        {#each SPOTS as s (s.id)}
          {@const on = order.has(s.id)}
          <polygon
            points={points(s.outline)}
            role="button"
            tabindex="0"
            aria-pressed={on}
            aria-label={t.spots[s.id].name}
            fill="transparent"
            vector-effect="non-scaling-stroke"
            stroke-linejoin="round"
            stroke-dasharray={on ? '12 12' : hover === s.id ? '0' : '6 8'}
            style="stroke:{on ? 'var(--color-volt)' : 'white'};stroke-width:{on ? 3 : 2};stroke-opacity:{on || hover === s.id ? 1 : 0.5}"
            class="cursor-pointer outline-none {on ? 'animate-ants' : ''}"
            onclick={() => order.toggle(s.id)}
            onkeydown={(e) => key(e, s.id)}
            onpointerenter={() => (hover = s.id)}
            onpointerleave={() => (hover = null)}
          />
        {/each}
      </svg>
    </div>

    <!-- Labels live outside the scaled stage so the text stays readable on phones. -->
    {#each SPOTS as s (s.id)}
      {@const on = order.has(s.id)}
      <button
        type="button"
        onclick={() => order.toggle(s.id)}
        onpointerenter={() => (hover = s.id)}
        onpointerleave={() => (hover = null)}
        aria-pressed={on}
        class="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full py-1 ps-1.5 pe-2.5 text-[11px] font-semibold whitespace-nowrap shadow-lg transition-all sm:text-xs {on
          ? 'bg-volt text-volt-ink'
          : 'bg-black/70 text-white backdrop-blur hover:bg-black/85'}"
        style={pct(s.label[0], s.label[1])}
        dir={settings.lang === 'ar' ? 'rtl' : 'ltr'}
      >
        <span class="grid size-4 place-items-center rounded-full {on ? 'bg-volt-ink text-volt' : 'bg-white/20'}">
          {#if on}<Check class="size-3" strokeWidth={3} />{:else}<Plus class="size-3" strokeWidth={3} />{/if}
        </span>
        {t.spots[s.id].name}
        <span class="font-mono opacity-70">{settings.money(PRICES[settings.currency][s.id])}</span>
      </button>
    {/each}
  </div>

  <p class="flex items-center gap-1.5 text-xs text-muted">
    <MousePointerClick class="size-3.5 shrink-0" />
    {t.clickToSelect}
  </p>

  <div class="rounded-2xl border border-line bg-surface p-4">
    <div class="mb-3">
      <h2 id="preview-title" class="font-bold">{t.previewTitle}</h2>
      <p class="text-sm text-muted">{t.previewHint}</p>
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <input bind:this={fileInput} type="file" accept="image/*" class="hidden" onchange={pick} />
      <button
        type="button"
        onclick={() => fileInput.click()}
        class="inline-flex h-10 items-center gap-2 rounded-lg bg-fg px-3.5 text-sm font-semibold text-bg transition-opacity hover:opacity-85"
      >
        <ImagePlus class="size-4" />
        {order.image ? t.replace : t.upload}
      </button>

      {#if order.image}
        <ToggleGroup.Root
          type="single"
          bind:value={() => order.fit, (v) => v && (order.fit = v as 'contain' | 'cover')}
          class="inline-flex h-10 items-center rounded-lg border border-line p-0.5"
        >
          <ToggleGroup.Item
            value="contain"
            class="h-full rounded-md px-3 text-xs font-medium text-muted data-[state=on]:bg-raised data-[state=on]:text-fg"
            >{t.fit}</ToggleGroup.Item
          >
          <ToggleGroup.Item
            value="cover"
            class="h-full rounded-md px-3 text-xs font-medium text-muted data-[state=on]:bg-raised data-[state=on]:text-fg"
            >{t.fill}</ToggleGroup.Item
          >
        </ToggleGroup.Root>
        <button
          type="button"
          onclick={() => order.setImage(null)}
          class="inline-flex h-10 items-center gap-1.5 rounded-lg border border-line px-3 text-sm text-muted hover:text-pink"
        >
          <X class="size-4" />
          {t.remove}
        </button>
      {:else}
        <label class="relative flex h-10 min-w-0 flex-1 basis-48 items-center">
          <span class="sr-only">{t.textLabel}</span>
          <Type class="pointer-events-none absolute start-3 size-4 text-muted" />
          <input
            type="text"
            bind:value={order.text}
            maxlength="40"
            placeholder={t.textPlaceholder}
            class="h-full w-full rounded-lg border border-line bg-bg ps-9 pe-3 text-sm outline-none placeholder:text-muted/70 focus:border-accent"
          />
        </label>
      {/if}
    </div>
  </div>
</section>
