import { learnUi } from '../i18n';
import type { Locale } from '../i18n';
import {
  LOGIC_AND_THEISM_READING_ROUTE_ID,
  LOGIC_FOUNDATIONS_ROUTE_ID,
} from './routes';

export function renderRoutePicker(locale: Locale, activeRouteId: string): string {
  const learn = learnUi(locale);
  return `
    <nav class="route-picker" data-testid="route-picker" aria-label="${learn.routeLabel}">
      <button type="button" class="unit-button ${activeRouteId === LOGIC_FOUNDATIONS_ROUTE_ID ? 'active' : ''}" data-action="set-route" data-route-id="${LOGIC_FOUNDATIONS_ROUTE_ID}" aria-pressed="${activeRouteId === LOGIC_FOUNDATIONS_ROUTE_ID}">${learn.routeFoundations}</button>
      <button type="button" class="unit-button ${activeRouteId === LOGIC_AND_THEISM_READING_ROUTE_ID ? 'active' : ''}" data-action="set-route" data-route-id="${LOGIC_AND_THEISM_READING_ROUTE_ID}" aria-pressed="${activeRouteId === LOGIC_AND_THEISM_READING_ROUTE_ID}">${learn.routeSobel}</button>
    </nav>
  `;
}
