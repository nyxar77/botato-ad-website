<script lang="ts">
  import { Moon, Sun } from '@lucide/svelte';
  import { settings } from '../settings.svelte';

  $effect(() => {
    document.documentElement.classList.toggle('dark', settings.dark);
  });
</script>

<button
  type="button"
  onclick={() => settings.toggleTheme()}
  aria-label={settings.dark ? settings.t.themeLight : settings.t.themeDark}
  title={settings.dark ? settings.t.themeLight : settings.t.themeDark}
  class="grid size-9 place-items-center rounded-lg border border-line bg-surface text-muted transition-colors hover:text-fg"
>
  {#if settings.dark}
    <Sun class="size-4" />
  {:else}
    <Moon class="size-4" />
  {/if}
</button>
