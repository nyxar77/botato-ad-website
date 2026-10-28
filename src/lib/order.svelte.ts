import type { SpotId } from './i18n';
import { MAX_VIDEOS } from './config';

class Order {
  spots = $state<SpotId[]>(['gs']);
  qty = $state(1);
  /** Object URL of the uploaded preview image (never leaves the browser). */
  image = $state<string | null>(null);
  imageName = $state('');
  fit = $state<'contain' | 'cover'>('contain');
  text = $state('');

  has(id: SpotId) {
    return this.spots.includes(id);
  }
  toggle(id: SpotId) {
    if (this.has(id)) {
      if (this.spots.length > 1) this.spots = this.spots.filter((s) => s !== id);
    } else {
      this.spots = [...this.spots, id].sort() as SpotId[];
    }
  }
  setSpots(v: SpotId[]) {
    if (v.length) this.spots = [...v].sort() as SpotId[];
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
