import { createAvatar } from '@dicebear/core';
import {avataaars } from '@dicebear/collection';

export function generateRandomAvatar(seed: string): string {
  const avatar = createAvatar(avataaars, {
    seed,
    backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9'],
    clothingColor: ['3c4f5c', '65c9ff', '262e33', '5199e4', '25557c'],
    hairColor: ['2c1b18', 'e8e1e1', 'd6b370', '724133', '4a312c'],
    skinColor: ['f8d25c', 'ffdbb4', 'edb98a', 'd08b5b', 'ae5d29'],
  });

  return avatar.toDataUriSync();
}