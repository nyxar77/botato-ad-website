import type { SpotId } from './i18n';
import { MAX_VIDEOS } from './config';

class Order {
  // Single offer: both screens always included for 600 DH
  spots = $state<SpotId[]>(['tv', 'gs']);
  qty = $state(1);
  /** Object URL of the uploaded preview image (never leaves the browser). */
  image = $state<string | null>(null);
  imageName = $state('');
  fit = $state<'contain' | 'cover'>('contain');
  text = $state('');

  has(id: SpotId) {
    return this.spots.includes(id);
  }
  toggle(_id: SpotId) {
    // Screen selection disabled for now — single package includes both screens
  }
  setSpots(_v: SpotId[]) {
    // Keep both screens active
    this.spots = ['tv', 'gs'];
  }
  inc() {
    if (this.qty < MAX_VIDEOS) this.qty++;
  }
  dec() {
    if (this.qty > 1) this.qty--;
  }
  setImage(file: File | null) {
    if (this.image) URL.revokeObjectURL(this.image);
    this.image = file ? URL.createObjectURL(file) : null;
    this.imageName = file?.name ?? '';
  }
}

export const order = new Order();
