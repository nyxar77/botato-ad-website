<script lang="ts">
  import { ToggleGroup } from 'bits-ui';
  import { Check, ImagePlus, Type, X } from '@lucide/svelte';
  import { SPOTS, STAGE } from '../config';
  import { quadTransform } from '../homography';
  import { order } from '../order.svelte';
  import { settings } from '../settings.svelte';

  let cw = $state(0);
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
    const targetW = (box[0] * 1.15) / Math.max(Math.min(chars, 10), 4);
    const targetH = box[1] * 0.28;
    return Math.max(22, Math.min(targetH, targetW));
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
</script>

<section aria-labelledby="preview-title" class="flex flex-col gap-3">
  <div
    class="relative overflow-hidden rounded-2xl border border-line bg-black shadow-lg ring-1 ring-black/5 {dragging
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

      <!-- Ad projection using 2D affine transforms so child text never intersects the background in 3D space -->
      {#each SPOTS as s (s.id)}
        <div
          class="pointer-events-none absolute inset-0"
          style="clip-path:polygon({s.clip.map(([x, y]) => `${x}px ${y}px`).join(',')})"
        >
          <div
            class="absolute top-0 left-0 grid origin-top-left place-items-center overflow-hidden bg-white"
            style="width:{s.box[0]}px;height:{s.box[1]}px;transform:{transforms[s.id]}"
          >
            {#if order.image}
              <img src={order.image} alt="" class="size-full" style="object-fit:{order.fit}" />
            {:else}
              <div class="flex h-full w-full flex-col items-center justify-center gap-3 p-5 text-center">
                <span
                  dir="auto"
                  class="max-w-full leading-[1.15] font-extrabold tracking-tight break-words text-[#15141a]"
                  style="font-size:{fontSize(s.box)}px"
                >
                  {label}
                </span>
                <span class="h-2 w-16 rounded-full bg-pink"></span>
              </div>
            {/if}
          </div>
        </div>
      {/each}

      <svg viewBox="0 0 {STAGE.w} {STAGE.h}" class="pointer-events-none absolute inset-0 size-full">
        <defs>
          <mask id="spot-cutout">
            <rect width={STAGE.w} height={STAGE.h} fill="white" />
            {#each SPOTS as s (s.id)}
              <polygon points={points(s.outline)} fill="black" />
            {/each}
          </mask>
        </defs>
        <rect width={STAGE.w} height={STAGE.h} fill="#05050a" fill-opacity="0.35" mask="url(#spot-cutout)" />

        {#each SPOTS as s (s.id)}
          <polygon
            points={points(s.outline)}
            fill="transparent"
            vector-effect="non-scaling-stroke"
            stroke-linejoin="round"
            stroke-dasharray="12 12"
            style="stroke:var(--color-volt);stroke-width:3;stroke-opacity:1"
            class="animate-ants outline-none"
          />
        {/each}
      </svg>
    </div>

    <!-- Clean static badges showing both screens included -->
    {#each SPOTS as s (s.id)}
      <div
        class="pointer-events-none absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full bg-volt py-0.5 ps-1 pe-2 text-[10px] font-semibold whitespace-nowrap text-volt-ink shadow-md sm:gap-1.5 sm:py-1 sm:ps-1.5 sm:pe-2.5 sm:text-xs"
        style={pct(s.label[0], s.label[1])}
        dir={settings.lang === 'ar' ? 'rtl' : 'ltr'}
      >
        <span class="grid size-3.5 place-items-center rounded-full bg-volt-ink text-volt sm:size-4">
          <Check class="size-2.5 sm:size-3" strokeWidth={3} />
        </span>
        {t.spots[s.id].name}
      </div>
    {/each}
  </div>

  <div class="rounded-2xl border border-line bg-surface p-3.5 sm:p-4">
    <div class="mb-3">
      <h2 id="preview-title" class="text-sm font-bold sm:text-base">{t.previewTitle}</h2>
      <p class="text-xs text-muted sm:text-sm">{t.previewHint}</p>
    </div>
    <div class="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      <input bind:this={fileInput} type="file" accept="image/*" class="hidden" onchange={pick} />
      <button
        type="button"
        onclick={() => fileInput.click()}
        class="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-fg px-4 text-sm font-semibold text-bg transition-opacity active:scale-[0.99] sm:h-10 sm:w-auto"
      >
        <ImagePlus class="size-4" />
        {order.image ? t.replace : t.upload}
      </button>

      {#if order.image}
        <div class="flex items-center gap-2">
          <ToggleGroup.Root
            type="single"
            bind:value={() => order.fit, (v) => v && (order.fit = v as 'contain' | 'cover')}
            class="inline-flex h-11 flex-1 items-center rounded-xl border border-line p-0.5 sm:h-10 sm:flex-initial"
          >
            <ToggleGroup.Item
              value="contain"
              class="h-full flex-1 rounded-lg px-3 text-xs font-medium text-muted data-[state=on]:bg-raised data-[state=on]:text-fg sm:flex-initial"
              >{t.fit}</ToggleGroup.Item
            >
            <ToggleGroup.Item
              value="cover"
              class="h-full flex-1 rounded-lg px-3 text-xs font-medium text-muted data-[state=on]:bg-raised data-[state=on]:text-fg sm:flex-initial"
              >{t.fill}</ToggleGroup.Item
            >
          </ToggleGroup.Root>
          <button
            type="button"
            onclick={() => order.setImage(null)}
            class="inline-flex h-11 items-center gap-1.5 rounded-xl border border-line px-3.5 text-sm text-muted hover:text-pink sm:h-10"
          >
            <X class="size-4" />
            {t.remove}
          </button>
        </div>
      {:else}
        <label class="relative flex h-11 w-full items-center sm:h-10 sm:min-w-0 sm:flex-1 sm:basis-48">
          <span class="sr-only">{t.textLabel}</span>
          <Type class="pointer-events-none absolute start-3.5 size-4 text-muted" />
          <input
            type="text"
            bind:value={order.text}
            maxlength="40"
            placeholder={t.textPlaceholder}
            class="h-full w-full rounded-xl border border-line bg-bg ps-10 pe-3.5 text-base outline-none placeholder:text-muted/70 focus:border-accent sm:text-sm"
          />
        </label>
      {/if}
    </div>
  </div>
</section>
