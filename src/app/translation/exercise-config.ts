import {
  TRANSLATE_001,
  TRANSLATE_002,
  TRANSLATE_003,
  TRANSLATE_004,
  TRANSLATE_005,
  TRANSLATE_006,
  type TranslationExerciseConfig,
} from './types';

const BY_ID: Record<string, TranslationExerciseConfig> = {
  [TRANSLATE_001.id]: TRANSLATE_001,
  [TRANSLATE_002.id]: TRANSLATE_002,
  [TRANSLATE_003.id]: TRANSLATE_003,
  [TRANSLATE_004.id]: TRANSLATE_004,
  [TRANSLATE_005.id]: TRANSLATE_005,
  [TRANSLATE_006.id]: TRANSLATE_006,
};

export function getTranslationExerciseConfig(id: string): TranslationExerciseConfig | undefined {
  return BY_ID[id];
}
