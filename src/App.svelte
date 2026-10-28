<script lang="ts">
  import { ToggleGroup, Tooltip } from 'bits-ui';
  import { Mail, Minus, Plus, Presentation, Tv } from '@lucide/svelte';
  import { Tween } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import Studio from './lib/components/Studio.svelte';
  import LanguageSelect from './lib/components/LanguageSelect.svelte';
  import CurrencySwitch from './lib/components/CurrencySwitch.svelte';
  import ThemeToggle from './lib/components/ThemeToggle.svelte';
  import CopyRow from './lib/components/CopyRow.svelte';
  import { BANK, EMAIL, MAX_VIDEOS, PRICES } from './lib/config';
  import type { SpotId } from './lib/i18n';
  import { order } from './lib/order.svelte';
  import { settings } from './lib/settings.svelte';

  const t = $derived(settings.t);
  const icons = { tv: Tv, gs: Presentation };

  const unit = $derived(settings.price(order.spots));
  const total = $derived(unit * order.qty);
  const shown = Tween.of(() => total, { duration: 350, easing: cubicOut });

  const spotName = $derived(order.spots.length === 2 ? t.both : t.spots[order.spots[0]].name);
  const msg = $derived(t.msg(spotName, order.qty, settings.money(total)));
  const mailto = $derived(
    `mailto:${EMAIL}?subject=${encodeURIComponent(t.subject(spotName))}&body=${encodeURIComponent(`${msg}\n\n${t.attach}`)}`,
  );

  // Keep <html lang/dir> in sync with the chosen language.
  $effect(() => {
    document.documentElement.lang = settings.lang;
    document.documentElement.dir = settings.lang === 'ar' ? 'rtl' : 'ltr';
  });

  // Hide the mobile bottom bar once the order section is on screen.
  let orderEl: HTMLElement;
  let orderVisible = $state(false);
  $effect(() => {
    const io = new IntersectionObserver(([e]) => (orderVisible = e.isIntersecting), { threshold: 0.2 });
    io.observe(orderEl);
    return () => io.disconnect();
  });
</script>

<Tooltip.Provider>
  <header class="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
      <a href="#top" class="flex items-center gap-2.5">
        <span class="grid size-8 place-items-center rounded-lg bg-pink font-mono text-sm font-bold text-white">b</span>
        <span class="leading-tight">
          <span class="block font-extrabold tracking-tight" dir="ltr">botato</span>
          <span class="hidden text-xs text-muted sm:block">{t.tagline}</span>
        </span>
      </a>
      <nav class="hidden items-center gap-6 text-sm text-muted md:flex">
        <a href="#spots" class="hover:text-fg">{t.navSpots}</a>
        <a href="#how" class="hover:text-fg">{t.navHow}</a>
        <a href="#pay" class="hover:text-fg">{t.navPay}</a>
      </nav>
      <div class="flex items-center gap-1.5">
        <LanguageSelect />
        <CurrencySwitch />
        <ThemeToggle />
      </div>
    </div>
  </header>

  <main id="top" class="mx-auto max-w-6xl px-4 pb-28 lg:pb-16">
    <!-- Hero: live preview + configurator -->
    <section id="spots" class="grid gap-8 pt-6 lg:grid-cols-12 lg:gap-10 lg:pt-10">
      <div class="lg:col-span-7">
        <div class="lg:sticky lg:top-24"><Studio /></div>
      </div>

      <div class="flex flex-col gap-6 lg:col-span-5">
        <div class="animate-rise">
          <span class="inline-block rounded-md bg-pink/15 px-2 py-0.5 font-mono text-[11px] font-semibold tracking-wider text-pink uppercase">
            {t.kicker}
          </span>
          <h1 class="mt-3 text-3xl leading-[1.1] font-extrabold tracking-tight text-balance sm:text-4xl">{t.title}</h1>
          <p class="mt-3 text-muted text-pretty">{t.lead}</p>
        </div>

        <div class="flex items-baseline gap-2">
          <span class="font-mono text-4xl font-semibold tabular-nums">{settings.money(Math.round(shown.current))}</span>
          <span class="text-sm text-muted">{t.perVideo(order.qty)}</span>
        </div>

        <div>
          <div class="mb-2 flex items-baseline justify-between gap-2">
            <span class="text-sm font-semibold">{t.spotsLabel}</span>
            <span class="text-xs text-muted">{t.spotsHint}</span>
          </div>
          <ToggleGroup.Root
            type="multiple"
            bind:value={() => order.spots, (v) => order.setSpots(v as SpotId[])}
            class="grid grid-cols-2 gap-2"
          >
            {#each ['tv', 'gs'] as const as id (id)}
              {@const Icon = icons[id]}
              <ToggleGroup.Item
                value={id}
                class="group flex flex-col items-start gap-2 rounded-xl border-2 border-line bg-surface p-3 text-start transition-colors hover:border-fg/25 data-[state=on]:border-accent"
              >
                <span class="flex w-full items-center justify-between">
                  <Icon class="size-5 text-muted group-data-[state=on]:text-accent" />
                  <span class="font-mono text-sm font-semibold">{settings.money(PRICES[settings.currency][id])}</span>
                </span>
                <span>
                  <span class="block text-sm font-bold">{t.spots[id].name}</span>
                  <span class="block text-xs text-muted">{t.spots[id].desc}</span>
                </span>
              </ToggleGroup.Item>
            {/each}
          </ToggleGroup.Root>
          <div class="mt-2 h-5 text-xs">
            {#if order.spots.length === 2}
              <span class="font-semibold text-accent">✓ {t.bundle}</span>
            {:else}
              <button type="button" class="text-muted underline underline-offset-2 hover:text-fg" onclick={() => order.setSpots(['gs', 'tv'])}>
                + {t.both} · {settings.money(PRICES[settings.currency].tv + PRICES[settings.currency].gs)}
              </button>
            {/if}
          </div>
        </div>

        <div class="flex items-center justify-between gap-4">
          <span class="text-sm font-semibold">{t.qtyLabel}</span>
          <div class="inline-flex items-center overflow-hidden rounded-xl border border-line bg-surface">
            <button type="button" aria-label={t.minus} onclick={() => order.dec()} disabled={order.qty <= 1} class="grid size-10 place-items-center hover:bg-raised disabled:opacity-30">
              <Minus class="size-4" />
            </button>
            <span class="w-10 text-center font-mono font-semibold tabular-nums" aria-live="polite">{order.qty}</span>
            <button type="button" aria-label={t.plus} onclick={() => order.inc()} disabled={order.qty >= MAX_VIDEOS} class="grid size-10 place-items-center hover:bg-raised disabled:opacity-30">
              <Plus class="size-4" />
            </button>
          </div>
        </div>

        <ul class="space-y-1.5 border-t border-line pt-4 text-sm text-muted">
          {#each t.bullets as b, i}
            <li class="flex gap-2"><span class="mt-2 size-1.5 shrink-0 rounded-full {i === 1 ? 'bg-pink' : 'bg-accent'}"></span>{b}</li>
          {/each}
        </ul>

        <a href="#order" class="hidden items-center justify-between rounded-xl bg-accent px-5 py-3.5 font-bold text-accent-ink transition-transform hover:-translate-y-0.5 lg:flex">
          <span>{t.cta}</span>
          <span class="font-mono">{settings.money(total)}</span>
        </a>
      </div>
    </section>

    <!-- How it works -->
    <section id="how" class="mt-20">
      <h2 class="text-2xl font-extrabold tracking-tight">{t.howTitle}</h2>
      <ol class="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {#each t.steps as s, i}
          <li class="rounded-2xl border border-line bg-surface p-4">
            <span class="font-mono text-xs font-semibold {['text-studio', 'text-pink', 'text-accent', 'text-studio'][i]}">0{i + 1}</span>
            <div class="mt-2 font-bold">{s.t}</div>
            <p class="mt-1 text-sm text-muted">{s.d}</p>
          </li>
        {/each}
      </ol>
    </section>

    <!-- Payment + order -->
    <section id="pay" class="mt-12 grid gap-4 lg:grid-cols-2">
      <div class="flex flex-col gap-2.5 rounded-2xl border border-line bg-surface p-5">
        <img src="/cih.png" alt="CIH Bank" width="331" height="93" class="mb-1 h-8 w-auto self-start rounded bg-white p-1" loading="lazy" />
        <h2 class="text-lg font-bold">{t.payTitle}</h2>
        <CopyRow label={t.holder} value={BANK.holder} copyable={false} />
        <CopyRow label="RIB" value={BANK.rib} compact />
        <CopyRow label="IBAN" value={BANK.iban} compact />
        <CopyRow label="SWIFT" value={BANK.swift} />
        <p class="text-xs text-muted">{t.payNote}</p>
        {#if settings.currency === 'EUR'}
          <p class="rounded-lg bg-studio/10 px-3 py-2 text-xs text-studio dark:text-[#8fb0ff]">{t.eurNote}</p>
        {/if}
      </div>

      <div id="order" bind:this={orderEl} class="flex flex-col gap-2.5 rounded-2xl border border-line bg-surface p-5">
        <h2 class="text-lg font-bold">{t.orderTitle}</h2>
        <CopyRow label={t.email} value={EMAIL} />
        <CopyRow label={t.orderText} value={msg} multiline />
        <p class="text-xs text-muted">{t.orderNote}</p>
        <a href={mailto} class="mt-auto flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3.5 font-bold text-accent-ink transition-transform hover:-translate-y-0.5">
          <Mail class="size-5" />
          {t.cta}
        </a>
      </div>
    </section>
  </main>

  <footer class="border-t border-line">
    <div class="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-muted">© 2026 botato · {t.footer}</div>
  </footer>

  <!-- Mobile order bar -->
  <div
    class="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/90 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md transition-transform duration-300 lg:hidden {orderVisible
      ? 'translate-y-full'
      : ''}"
  >
    <div class="mx-auto flex max-w-6xl items-center justify-between gap-3">
      <div class="leading-tight">
        <div class="text-xs text-muted">{t.total} · {spotName} × {order.qty}</div>
        <div class="font-mono text-lg font-semibold">{settings.money(total)}</div>
      </div>
      <a href="#order" class="rounded-xl bg-accent px-5 py-3 text-sm font-bold text-accent-ink">{t.navPay}</a>
    </div>
  </div>
</Tooltip.Provider>
