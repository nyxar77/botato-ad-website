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
  let el: HTMLElement;

  async function copy() {
    const text = compact ? value.replace(/\s/g, '') : value;
    try {
      await navigator.clipboard.writeText(text);
      done = true;
      setTimeout(() => (done = false), 1500);
    } catch {
      const r = document.createRange();
      r.selectNodeContents(el);
      const s = getSelection();
      s?.removeAllRanges();
      s?.addRange(r);
    }
  }
</script>

<div class="flex items-center justify-between gap-3 rounded-lg border border-line bg-bg px-3 py-2.5">
  <div class="min-w-0">
    <div class="text-xs text-muted">{label}</div>
    <div
      bind:this={el}
      class={multiline
        ? 'mt-0.5 text-sm whitespace-pre-line'
        : 'mt-0.5 font-mono text-[13px] font-semibold break-all tabular-nums'}
      dir={multiline ? undefined : 'ltr'}
      style:unicode-bidi={multiline ? undefined : 'isolate'}
    >
      {value}
    </div>
  </div>
  {#if copyable}
    <button
      type="button"
      onclick={copy}
      class="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 text-xs font-medium transition-colors hover:border-fg/40 {done
        ? 'border-accent! text-accent'
        : ''}"
    >
      {#if done}<Check class="size-3.5" />{settings.t.copied}{:else}<Copy class="size-3.5" />{settings.t.copy}{/if}
    </button>
  {/if}
</div>
