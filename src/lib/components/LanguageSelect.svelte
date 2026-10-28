<script lang="ts">
  import { Select } from 'bits-ui';
  import { Check, ChevronDown, Languages } from '@lucide/svelte';
  import { LANGS, type Lang } from '../i18n';
  import { settings } from '../settings.svelte';

  const current = $derived(LANGS.find((l) => l.code === settings.lang)!);
</script>

<Select.Root
  type="single"
  value={settings.lang}
  onValueChange={(v) => v && settings.setLang(v as Lang)}
  items={LANGS.map((l) => ({ value: l.code, label: l.label }))}
>
  <Select.Trigger
    aria-label={settings.t.language}
    class="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 text-sm font-medium transition-colors hover:border-fg/30 data-[state=open]:border-accent"
  >
    <Languages class="size-4 text-muted" />
    <span class="hidden sm:inline">{current.label}</span>
    <span class="font-mono text-xs sm:hidden">{current.short}</span>
    <ChevronDown class="size-3.5 text-muted" />
  </Select.Trigger>
  <Select.Portal>
    <Select.Content
      sideOffset={6}
      align="end"
      class="z-50 min-w-40 rounded-xl border border-line bg-surface p-1 shadow-xl shadow-black/20 data-[state=open]:animate-rise"
    >
      <Select.Viewport>
        {#each LANGS as l (l.code)}
          <Select.Item
            value={l.code}
            label={l.label}
            class="flex cursor-pointer items-center justify-between gap-6 rounded-lg px-3 py-2 text-sm outline-none select-none data-highlighted:bg-raised"
          >
            {#snippet children({ selected })}
              <span lang={l.code} class={l.code === 'ar' ? 'font-[Cairo_Variable]' : ''}>{l.label}</span>
              <span class="flex items-center gap-2">
                <span class="font-mono text-[10px] text-muted">{l.short}</span>
                <Check class="size-4 text-accent {selected ? '' : 'invisible'}" />
              </span>
            {/snippet}
          </Select.Item>
        {/each}
      </Select.Viewport>
    </Select.Content>
  </Select.Portal>
</Select.Root>
