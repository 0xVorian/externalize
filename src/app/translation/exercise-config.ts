import { TRANSLATE_001, type TranslationExerciseConfig } from './types';

const BY_ID: Record<string, TranslationExerciseConfig> = {
  [TRANSLATE_001.id]: TRANSLATE_001,
};

export function getTranslationExerciseConfig(id: string): TranslationExerciseConfig | undefined {
  return BY_ID[id];
}
