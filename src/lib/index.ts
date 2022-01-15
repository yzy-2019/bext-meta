import { config } from '@/util/config';
import {
  alook_install,
  bz_install,
  lit_install,
  lit_installed,
  lit_uninstall,
  shark_install,
  shark_installed,
  shark_uninstall,
  via_install,
  via_installed,
  via_uninstall,
  x_install,
  x_installed,
  x_uninstall,
} from '@bext/browser';
import { buildMethods } from '@bext/browser';

// mock
if (config.env === 'dev' && !window?.alook?.addon) {
  window.alook = {
    addon: console.log,
  };
}

export const browser = buildMethods({
  alook_install,
  bz_install,
  lit_install,
  lit_installed,
  lit_uninstall,
  shark_install,
  shark_installed,
  shark_uninstall,
  via_install,
  via_installed,
  via_uninstall,
  x_install,
  x_installed,
  x_uninstall,
});
