/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import os from 'node:os';

export function isJetBrainsTerminal(): boolean {
  return process.env['TERMINAL_EMULATOR'] === 'JetBrains-JediTerm';
}

export function isCmder(): boolean {
  return !!process.env['CMDER_ROOT'];
}

/**
 * Determines if the alternate buffer should be disabled by default based on the environment.
 *
 * Currently disabled for:
 * - JetBrains terminals (scrolling issues)
 * - Windows 10 (legacy console issues)
 * - tmux (rendering artifacts)
 * - Cmder (rendering artifacts)
 */
export function shouldDisableAlternateBufferByDefault(): boolean {
  if (isJetBrainsTerminal()) {
    return true;
  }
  if (process.env['TMUX']) {
    return true;
  }
  if (isCmder()) {
    return true;
  }
  if (process.platform === 'win32' && os.release().startsWith('10.')) {
    return true;
  }
  return false;
}
