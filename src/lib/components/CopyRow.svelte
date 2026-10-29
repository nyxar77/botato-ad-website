<script lang="ts">
  import { Check, Copy } from '@lucide/svelte';
  import { settings } from '../settings.svelte';

  let {
    label,
    value,
    /** Strip whitespace when copying (bank numbers). */
    compact = false,
    multiline = false,
    copyable = true,
  }: { label: string; value: string; compact?: boolean; multiline?: boolean; copyable?: boolean } = $props();

  let done = $state(false);
  let el = $state<HTMLElement>();

  async function copy() {
    if (!copyable) return;
    const text = compact ? value.replace(/\s/g, '') : value;
    try {
      await navigator.clipboard.writeText(text);
      done = true;
      setTimeout(() => (done = false), 1500);
    } catch {
      if (!el) return;
      const r = document.createRange();
      r.selectNodeContents(el);
      const s = getSelection();
      s?.removeAllRanges();
      s?.addRange(r);
    }
  }
</script>

{#if copyable}
  <button
    type="button"
    onclick={copy}
    class="group flex w-full items-center justify-between gap-3 rounded-xl border border-line bg-bg px-3.5 py-3 text-start transition-all active:scale-[0.99] {done
      ? 'border-accent bg-accent/5'
      : 'hover:border-fg/30'}"
  >
    <div class="min-w-0 flex-1">
      <div class="text-xs text-muted">{label}</div>
      <div
        bind:this={el}
        class={multiline
          ? 'mt-1 text-sm leading-relaxed whitespace-pre-line'
          : 'mt-0.5 font-mono text-xs font-semibold break-all tabular-nums sm:text-[13px]'}
        dir={multiline ? undefined : 'ltr'}
        style:unicode-bidi={multiline ? undefined : 'isolate'}
      >
        {value}
      </div>
    </div>
    <span
      class="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-colors {done
        ? 'border-accent bg-accent text-accent-ink'
        : 'border-line bg-surface text-fg group-hover:border-fg/40'}"
    >
      {#if done}
        <Check class="size-3.5" strokeWidth={2.5} />
        {settings.t.copied}
      {:else}
        <Copy class="size-3.5" />
        {settings.t.copy}
      {/if}
    </span>
  </button>
{:else}
  <div class="flex items-center justify-between gap-3 rounded-xl border border-line bg-bg px-3.5 py-3">
    <div class="min-w-0">
      <div class="text-xs text-muted">{label}</div>
      <div
        bind:this={el}
        class="mt-0.5 font-mono text-xs font-semibold break-all tabular-nums sm:text-[13px]"
        dir="ltr"
        style:unicode-bidi="isolate"
      >
        {value}
      </div>
    </div>
  </div>
{/if}
