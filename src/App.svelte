<script lang="ts">
  import { Tooltip } from 'bits-ui';
  import { Check, Mail, Minus, Plus, Presentation, Tv } from '@lucide/svelte';
  import { Tween } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import Studio from './lib/components/Studio.svelte';
  import LanguageSelect from './lib/components/LanguageSelect.svelte';
  import CurrencySwitch from './lib/components/CurrencySwitch.svelte';
  import ThemeToggle from './lib/components/ThemeToggle.svelte';
  import CopyRow from './lib/components/CopyRow.svelte';
  import { BANK, EMAIL, MAX_VIDEOS } from './lib/config';
  import { order } from './lib/order.svelte';
  import { settings } from './lib/settings.svelte';

  const t = $derived(settings.t);

  // Single unified offer: both screens for 600 DH (or €60)
  const unit = $derived(settings.price(order.spots));
  const total = $derived(unit * order.qty);
  const shown = Tween.of(() => total, { duration: 300, easing: cubicOut });

  const spotName = $derived(t.bundle);
  const msg = $derived(t.msg(spotName, order.qty, settings.money(total)));
  const mailto = $derived(
    `mailto:${EMAIL}?subject=${encodeURIComponent(t.subject(spotName))}&body=${encodeURIComponent(`${msg}\n\n${t.attach}`)}`,
  );

  // Keep <html lang/dir> and document.title in sync with the chosen language.
  $effect(() => {
    document.documentElement.lang = settings.lang;
    document.documentElement.dir = settings.lang === 'ar' ? 'rtl' : 'ltr';
    document.title = t.tagline;
  });

  // Hide the mobile bottom bar once the order section is on screen.
  let orderEl: HTMLElement;
  let orderVisible = $state(false);
  $effect(() => {
    const io = new IntersectionObserver(([e]) => (orderVisible = e.isIntersecting), { threshold: 0.15 });
    io.observe(orderEl);
    return () => io.disconnect();
  });
</script>

<Tooltip.Provider>
  <header class="sticky top-0 z-50 border-b border-line bg-bg/95 backdrop-blur-md">
    <div class="mx-auto flex h-14 max-w-5xl items-center justify-between gap-2 px-3.5 sm:h-16 sm:px-4">
      <nav class="flex items-center gap-4 text-sm font-semibold text-muted sm:gap-5">
        <a href="#spots" class="py-1 transition-colors hover:text-fg">{t.navSpots}</a>
        <a href="#pay" class="py-1 transition-colors hover:text-fg">{t.navPay}</a>
      </nav>
      <div class="flex items-center gap-1.5 sm:gap-2">
        <LanguageSelect />
        <CurrencySwitch />
        <ThemeToggle />
      </div>
    </div>
  </header>

  <main id="top" class="mx-auto max-w-5xl px-3.5 pb-28 sm:px-4 lg:pb-16">
    <!-- Hero: live preview + clean minimalist booking details -->
    <section id="spots" class="grid gap-5 pt-4 sm:gap-8 sm:pt-6 lg:grid-cols-12 lg:gap-10 lg:pt-10">
      <div class="lg:col-span-7">
        <div class="lg:sticky lg:top-24"><Studio /></div>
      </div>

      <div class="flex flex-col gap-4 sm:gap-5 lg:col-span-5">
        <div>
          <span class="inline-block rounded-md bg-accent/10 px-2.5 py-0.5 font-mono text-xs font-semibold text-accent">
            {t.kicker}
          </span>
          <h1 class="mt-2 text-2xl leading-tight font-extrabold tracking-tight sm:mt-2.5 sm:text-4xl">{t.title}</h1>
          <p class="mt-1.5 text-sm text-muted sm:mt-2">{t.lead}</p>
        </div>

        <!-- Unified Price Display -->
        <div class="flex items-baseline gap-2 border-y border-line py-3.5 sm:py-4">
          <span class="font-mono text-3xl font-bold tabular-nums sm:text-4xl">{settings.money(Math.round(shown.current))}</span>
          <span class="text-sm text-muted">{t.perVideo(order.qty)}</span>
        </div>

        <!-- Single Offer Card (Both Screens Included) -->
        <div>
          <div class="mb-1.5 text-xs font-semibold text-muted sm:mb-2 sm:text-sm">{t.spotsLabel}</div>
          <div class="flex items-center justify-between gap-3 rounded-xl border-2 border-accent bg-surface p-3.5">
            <div class="flex items-center gap-3">
              <div class="flex items-center -space-x-1 rtl:space-x-reverse">
                <span class="grid size-8 place-items-center rounded-lg bg-accent/15 text-accent">
                  <Tv class="size-4" />
                </span>
                <span class="grid size-8 place-items-center rounded-lg bg-accent/15 text-accent">
                  <Presentation class="size-4" />
                </span>
              </div>
              <div>
                <div class="text-sm font-bold">{t.spots.tv.name} + {t.spots.gs.name}</div>
                <div class="text-xs text-muted">{t.both} ({t.bundle})</div>
              </div>
            </div>
            <span class="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-accent-ink">
              <Check class="size-3.5" strokeWidth={3} />
            </span>
          </div>
        </div>

        <!-- Number of videos selector (large thumb-friendly controls on mobile) -->
        <div class="flex items-center justify-between gap-4 rounded-xl border border-line bg-surface p-3 sm:p-3.5">
          <span class="text-sm font-semibold">{t.qtyLabel}</span>
          <div class="inline-flex items-center overflow-hidden rounded-xl border border-line bg-bg">
            <button
              type="button"
              aria-label={t.minus}
              onclick={() => order.dec()}
              disabled={order.qty <= 1}
              class="grid size-11 place-items-center active:bg-raised disabled:opacity-30 sm:size-10 sm:hover:bg-raised"
            >
              <Minus class="size-4" />
            </button>
            <span class="w-11 text-center font-mono text-base font-bold tabular-nums sm:w-10" aria-live="polite">{order.qty}</span>
            <button
              type="button"
              aria-label={t.plus}
              onclick={() => order.inc()}
              disabled={order.qty >= MAX_VIDEOS}
              class="grid size-11 place-items-center active:bg-raised disabled:opacity-30 sm:size-10 sm:hover:bg-raised"
            >
              <Plus class="size-4" />
            </button>
          </div>
        </div>

        <ul class="space-y-1.5 text-xs text-muted sm:text-sm">
          {#each t.bullets as b, i}
            <li class="flex gap-2">
              <span class="mt-1.5 size-1.5 shrink-0 rounded-full {i === 1 ? 'bg-pink' : 'bg-accent'}"></span>{b}
            </li>
          {/each}
        </ul>
      </div>
    </section>

    <!-- Payment + order -->
    <section id="pay" class="mt-8 grid gap-4 sm:mt-12 sm:gap-6 lg:grid-cols-2">
      <div class="relative flex flex-col gap-3 rounded-2xl border-2 border-accent bg-surface p-4 shadow-lg shadow-accent/5 ring-4 ring-accent/10 sm:p-5">
        <div class="flex items-center justify-between gap-3">
          <img src="/cih.png" alt="CIH Bank" width="331" height="93" class="h-8 w-auto rounded bg-white p-1 shadow-xs" loading="lazy" />
          <span class="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-bold text-accent">CIH Bank</span>
        </div>
        <h2 class="text-base font-extrabold tracking-tight sm:text-lg">{t.payTitle}</h2>
        <div class="space-y-2">
          <CopyRow label={t.holder} value={BANK.holder} copyable={false} />
          <CopyRow label="RIB" value={BANK.rib} compact />
          <CopyRow label="IBAN" value={BANK.iban} compact />
          <CopyRow label="SWIFT" value={BANK.swift} />
        </div>
        <p class="text-xs text-muted">{t.payNote}</p>
        {#if settings.currency === 'EUR'}
          <p class="rounded-lg bg-studio/10 px-3 py-2 text-xs text-studio dark:text-[#8fb0ff]">{t.eurNote}</p>
        {/if}
      </div>

      <div id="order" bind:this={orderEl} class="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 sm:p-5">
        <h2 class="text-base font-extrabold tracking-tight sm:text-lg">{t.orderTitle}</h2>
        <div class="space-y-2">
          <CopyRow label={t.email} value={EMAIL} />
          <CopyRow label={t.orderText} value={msg} multiline />
        </div>
        <p class="text-xs text-muted">{t.orderNote}</p>
        <a
          href={mailto}
          class="mt-auto flex h-12 items-center justify-center gap-2 rounded-xl bg-accent px-5 text-base font-bold text-accent-ink shadow-md shadow-accent/20 transition-all active:scale-[0.99] sm:h-auto sm:py-3.5"
        >
          <Mail class="size-5" />
          {t.cta}
        </a>
      </div>
    </section>
  </main>

  <footer class="border-t border-line">
    <div class="mx-auto max-w-5xl px-4 py-6 text-center text-xs text-muted">© 2026 · {t.footer}</div>
  </footer>

  <!-- Mobile order bar: quick quantity stepper + total + jump to payment -->
  <div
    class="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 px-3.5 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md transition-transform duration-300 lg:hidden {orderVisible
      ? 'translate-y-full'
      : ''}"
  >
    <div class="mx-auto flex max-w-5xl items-center justify-between gap-2.5">
      <div class="min-w-0">
        <div class="truncate text-[11px] font-medium text-muted">{t.total} ({order.qty === 1 ? '1' : order.qty})</div>
        <div class="font-mono text-lg leading-tight font-bold tabular-nums">{settings.money(total)}</div>
      </div>

      <div class="flex items-center gap-2">
        <!-- Quick +/- stepper right in the sticky bottom bar -->
        <div class="inline-flex h-11 items-center overflow-hidden rounded-xl border border-line bg-bg">
          <button
            type="button"
            aria-label={t.minus}
            onclick={() => order.dec()}
            disabled={order.qty <= 1}
            class="grid size-10 place-items-center active:bg-raised disabled:opacity-30"
          >
            <Minus class="size-4" />
          </button>
          <span class="w-6 text-center font-mono text-sm font-bold tabular-nums">{order.qty}</span>
          <button
            type="button"
            aria-label={t.plus}
            onclick={() => order.inc()}
            disabled={order.qty >= MAX_VIDEOS}
            class="grid size-10 place-items-center active:bg-raised disabled:opacity-30"
          >
            <Plus class="size-4" />
          </button>
        </div>

        <a
          href="#pay"
          class="inline-flex h-11 items-center justify-center rounded-xl bg-accent px-5 text-sm font-bold text-accent-ink shadow-sm active:scale-[0.98]"
        >
          {t.navPay}
        </a>
      </div>
    </div>
  </div>
</Tooltip.Provider>
