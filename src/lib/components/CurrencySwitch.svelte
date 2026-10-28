<script lang="ts">
  import { ToggleGroup, Tooltip } from 'bits-ui';
  import type { Currency } from '../i18n';
  import { settings } from '../settings.svelte';

  const options: { value: Currency; label: string }[] = [
    { value: 'MAD', label: 'DH' },
    { value: 'EUR', label: '€' },
  ];
</script>

<Tooltip.Root delayDuration={300}>
  <Tooltip.Trigger>
    {#snippet child({ props })}
      <div {...props} dir="ltr">
        <ToggleGroup.Root
          type="single"
          value={settings.currency}
          onValueChange={(v) => v && settings.setCurrency(v as Currency)}
          aria-label={settings.t.currency}
          class="inline-flex h-9 items-center rounded-lg border border-line bg-surface p-0.5"
        >
          {#each options as o (o.value)}
            <ToggleGroup.Item
              value={o.value}
              aria-label={o.value}
              class="h-full min-w-9 rounded-md px-2 font-mono text-xs font-semibold text-muted transition-colors hover:text-fg data-[state=on]:bg-fg data-[state=on]:text-bg"
            >
              {o.label}
            </ToggleGroup.Item>
          {/each}
        </ToggleGroup.Root>
      </div>
    {/snippet}
  </Tooltip.Trigger>
  <Tooltip.Portal>
    <Tooltip.Content
      sideOffset={6}
      class="z-50 max-w-56 rounded-lg bg-fg px-3 py-2 text-xs text-bg shadow-lg data-[state=delayed-open]:animate-rise"
    >
      {settings.t.currency}{settings.currencyIsAuto ? ` · ${settings.t.currencyAuto}` : ''}
    </Tooltip.Content>
  </Tooltip.Portal>
</Tooltip.Root>
