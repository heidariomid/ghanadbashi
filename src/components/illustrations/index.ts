import type { ComponentType } from 'react'

import { Arches } from './Arches'
import { Baklava } from './Baklava'
import { BirthdayCake } from './BirthdayCake'
import { CakeSlice } from './CakeSlice'
import { CakeStand } from './CakeStand'
import { CheesecakeSlice } from './CheesecakeSlice'
import { ChocolateCake } from './ChocolateCake'
import { CinnamonRoll } from './CinnamonRoll'
import { Cookie } from './Cookie'
import { CreamPuff } from './CreamPuff'
import { DessertCup } from './DessertCup'
import { FruitTart } from './FruitTart'
import { GiftBox } from './GiftBox'
import { HeroCake } from './HeroCake'
import { Jar } from './Jar'
import { NestedArcs } from './NestedArcs'
import { PlateComposition } from './PlateComposition'
import { Sprig } from './Sprig'

export interface IllustrationProps {
  className?: string
}

/**
 * Every drawing in the set, keyed. Content in `src/data/content.ts` refers to
 * these keys, so swapping the art for a category or product is a one-line edit.
 */
export const illustrations = {
  heroCake: HeroCake,

  // categories — 48×48 viewBox
  birthdayCake: BirthdayCake,
  cakeSlice: CakeSlice,
  cookie: Cookie,
  dessertCup: DessertCup,
  sprig: Sprig,
  jar: Jar,
  giftBox: GiftBox,

  // products — 120×120 viewBox
  chocolateCake: ChocolateCake,
  cheesecakeSlice: CheesecakeSlice,
  baklava: Baklava,
  creamPuff: CreamPuff,
  cinnamonRoll: CinnamonRoll,
  fruitTart: FruitTart,

  // gallery — 240×300 viewBox
  nestedArcs: NestedArcs,
  arches: Arches,
  plateComposition: PlateComposition,
  cakeStand: CakeStand,
} satisfies Record<string, ComponentType<IllustrationProps>>

export type IllustrationKey = keyof typeof illustrations

export {
  Arches,
  Baklava,
  BirthdayCake,
  CakeSlice,
  CakeStand,
  CheesecakeSlice,
  ChocolateCake,
  CinnamonRoll,
  Cookie,
  CreamPuff,
  DessertCup,
  FruitTart,
  GiftBox,
  HeroCake,
  Jar,
  NestedArcs,
  PlateComposition,
  Sprig,
}
