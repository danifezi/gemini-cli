/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { persistentState } from '../../utils/persistentState.js';
import { coreEvents } from '@google/gemini-cli-core';
import { isAlternateBufferEnabled } from './useAlternateBuffer.js';
import type { LoadedSettings } from '../../config/settings.js';
import { isJetBrainsTerminal } from '../../utils/terminalEnvironment.js';

const MAX_NUDGE_COUNT = 3;

export function useAlternateBufferNudge(settings: LoadedSettings) {
  useEffect(() => {
    const enabled = isAlternateBufferEnabled(settings);

    // Only nudge if alternate buffer is NOT enabled
    if (!enabled) {
      const currentCount =
        persistentState.get('alternateBufferNudgeCount') || 0;

      if (currentCount < MAX_NUDGE_COUNT) {
        let message: string;
        if (isJetBrainsTerminal()) {
          message =
            'Alternate buffer is disabled in JetBrains terminal. Enable "Force Alternate Screen Buffer" in /settings to override. See https://github.com/google-gemini/gemini-cli/issues/13614 for details.';
        } else {
          message =
            'Alternate buffer is disabled by default in this environment. Enable "Force Alternate Screen Buffer" in /settings to override.';
        }

        coreEvents.emitFeedback('info', message);

        persistentState.set('alternateBufferNudgeCount', currentCount + 1);
      }
    }
  }, [settings]);
}
