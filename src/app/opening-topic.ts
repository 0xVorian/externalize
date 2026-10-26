import type { Locale } from '../i18n';
import { getLessonCopy } from '../i18n';
import { getExerciseDefinition } from './exercises';
import { getLessonDefinition } from './lessons';
import { conceptForItem, conceptLabel } from './prerequisites';
import type { OpeningOffer, SessionStep } from './session-types';

function topicSteps(offer: OpeningOffer): SessionStep[] {
  if (!offer.plan) {
    return [];
  }
  const from = offer.kind === 'resume' ? (offer.resumeIndex ?? 0) : 0;
  const remaining = offer.plan.steps.slice(from);
  const withoutWarmup = remaining.filter((step) => step.role !== 'warmup');
  return withoutWarmup.length > 0 ? withoutWarmup : remaining;
}

function isTeachingLesson(itemId: string): boolean {
  return Boolean(getLessonDefinition(itemId) && !getExerciseDefinition(itemId));
}

function itemTopic(locale: Locale, itemId: string): string {
  const conceptId = conceptForItem(itemId);
  if (conceptId) {
    const label = conceptLabel(locale, conceptId);
    if (label !== conceptId) {
      return label;
    }
  }
  if (isTeachingLesson(itemId)) {
    return getLessonCopy(locale, itemId).title;
  }
  return conceptId ? conceptLabel(locale, conceptId) : itemId;
}

/** Learner-facing name of the concept or lesson an opening round covers. */
export function openingTopic(locale: Locale, offer: OpeningOffer): string | undefined {
  const steps = topicSteps(offer);
  if (steps.length === 0) {
    return undefined;
  }
  const concepts = [
    ...new Set(
      steps
        .map((step) => step.conceptId ?? conceptForItem(step.itemId))
        .filter((id): id is string => Boolean(id)),
    ),
  ];
  if (concepts.length === 1) {
    return conceptLabel(locale, concepts[0]!);
  }
  const first = steps[0]!;
  if (isTeachingLesson(first.itemId)) {
    return getLessonCopy(locale, first.itemId).title;
  }
  return itemTopic(locale, first.itemId);
}
