import { SvelteComponentTyped } from 'svelte';

export default class Icon extends SvelteComponentTyped<{
  size?: string | number;
  color?: string;
  strokeWidth?: string | number;
  strokeLinecap?: string | number;
  strokeLinejoin?: string | number;
}> {}
