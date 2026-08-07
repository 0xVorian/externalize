import type { Locale } from '../i18n';
import { onboardingUi } from '../i18n';
const N=3;
export function renderOnboarding(locale: Locale, step: number): string {
  const c=onboardingUi(locale), i=Math.max(0,Math.min(step,N-1)), s=c.screens[i], last=i===N-1;
  return `<div class="onboarding-overlay" role="dialog" aria-modal="true" aria-labelledby="onboarding-title"><div class="onboarding-card"><p class="onboarding-step" aria-hidden="true">${c.stepLabel(i+1,N)}</p><h1 class="onboarding-title" id="onboarding-title">${s.title}</h1><p class="onboarding-body">${s.body}</p>${s.visual?`<div class="onboarding-visual" aria-hidden="true">${s.visual}</div>`:''}<div class="onboarding-actions">${last?`<button type="button" class="primary" data-action="onboarding-finish">${c.getStarted}</button>`:`<button type="button" class="primary" data-action="onboarding-next">${c.next}</button>`}<button type="button" class="secondary" data-action="onboarding-skip">${c.skip}</button></div></div></div>`;
}
