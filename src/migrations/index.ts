import * as migration_20260819_153742_initial from './20260819_153742_initial';
import * as migration_20260821_094300_hero_rotating_words from './20260821_094300_hero_rotating_words';

export const migrations = [
  {
    up: migration_20260819_153742_initial.up,
    down: migration_20260819_153742_initial.down,
    name: '20260819_153742_initial',
  },
  {
    up: migration_20260821_094300_hero_rotating_words.up,
    down: migration_20260821_094300_hero_rotating_words.down,
    name: '20260821_094300_hero_rotating_words'
  },
];
