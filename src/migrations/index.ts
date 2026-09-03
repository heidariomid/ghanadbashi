import * as migration_20260819_153742_initial from './20260819_153742_initial';
import * as migration_20260821_094300_hero_rotating_words from './20260821_094300_hero_rotating_words';
import * as migration_20260823_093136_gallery_cart from './20260823_093136_gallery_cart';
import * as migration_20260823_095000_cms_categories from './20260823_095000_cms_categories';
import * as migration_20260901_204610_order_notification_phone from './20260901_204610_order_notification_phone';
import * as migration_20260902_093253_last_customer_sms from './20260902_093253_last_customer_sms';
import * as migration_20260902_181206_phone_verifications from './20260902_181206_phone_verifications';
import * as migration_20260903_191500_deposit_sms from './20260903_191500_deposit_sms';
import * as migration_20260903_200000_deposit_receipt from './20260903_200000_deposit_receipt';

export const migrations = [
  {
    up: migration_20260819_153742_initial.up,
    down: migration_20260819_153742_initial.down,
    name: '20260819_153742_initial',
  },
  {
    up: migration_20260821_094300_hero_rotating_words.up,
    down: migration_20260821_094300_hero_rotating_words.down,
    name: '20260821_094300_hero_rotating_words',
  },
  {
    up: migration_20260823_093136_gallery_cart.up,
    down: migration_20260823_093136_gallery_cart.down,
    name: '20260823_093136_gallery_cart',
  },
  {
    up: migration_20260823_095000_cms_categories.up,
    down: migration_20260823_095000_cms_categories.down,
    name: '20260823_095000_cms_categories',
  },
  {
    up: migration_20260901_204610_order_notification_phone.up,
    down: migration_20260901_204610_order_notification_phone.down,
    name: '20260901_204610_order_notification_phone',
  },
  {
    up: migration_20260902_093253_last_customer_sms.up,
    down: migration_20260902_093253_last_customer_sms.down,
    name: '20260902_093253_last_customer_sms',
  },
  {
    up: migration_20260902_181206_phone_verifications.up,
    down: migration_20260902_181206_phone_verifications.down,
    name: '20260902_181206_phone_verifications'
  },
  {
    up: migration_20260903_191500_deposit_sms.up,
    down: migration_20260903_191500_deposit_sms.down,
    name: '20260903_191500_deposit_sms',
  },
  {
    up: migration_20260903_200000_deposit_receipt.up,
    down: migration_20260903_200000_deposit_receipt.down,
    name: '20260903_200000_deposit_receipt',
  },
];
