import './styles/main.css';
import { getExerciseDefinition } from './app/exercises';
import {
  checkClassification,
  checkEvaluation,
  createState,
  selectClassificationChoice,
  selectEvaluationPrediction,
  showHint,
  submitCellValue,
  tryAgainPractice,
  type AppState,
} from './app/state';
import { renderApp, type PracticeViewContext } from './app/render';
import { loadLocale, type Locale } from './i18n';

type ExampleKey = 'choice' | 'evaluation' | 'truth-table';

const EXAMPLES: Record<ExampleKey, { title: string; detail: string; exerciseId: string }> = {
  choice: {
    title: 'Choice question',
    detail: 'Plain-language stimulus with a distinct answer workspace.',
    exerciseId: 'lat-predict-empty-club',
  },
  evaluation: {
    title: 'Formula evaluation',
    detail: 'Logical object above, True / False response plane below.',
    exerciseId: 'eval-001',
  },
  'truth-table': {
    title: 'Truth-table cell',
    detail: 'The response stays embedded where its position carries meaning.',
    exerciseId: 'tt-001',
  },
};

const appRoot = document.querySelector<HTMLDivElement>('#app');
if (!appRoot) throw new Error('Missing #app root element');
const root = appRoot;

const locale: Locale = loadLocale();
let selected: ExampleKey | null = null;
let state: AppState | null = null;

function launcher(): string {
  const buttons = (Object.entries(EXAMPLES) as Array<[ExampleKey, (typeof EXAMPLES)[ExampleKey]]>)
    .map(
      ([key, example]) => `
        <button type="button" class="choice-option" data-action="visual-example" data-example="${key}">
          <strong>${example.title}</strong><br />
          <span style="color:var(--muted);font-size:.875rem;font-weight:400">${example.detail}</span>
        </button>`,
    )
    .join('');

  return `
    <main class="app visual-grammar-launcher" lang="${locale}">
      <h1 style="margin:1rem 0 .5rem">Exercise visual grammar</h1>
      <p style="margin:0 0 1.5rem;color:var(--muted)">Temporary PR #16 preview. Pick one of the three representative interactions.</p>
      <div class="choice-list">${buttons}</div>
    </main>`;
}

function context(): PracticeViewContext {
  return {
    capabilityState: 'ready',
    sessionCompleted: 0,
    sessionTarget: 1,
    sessionComplete: false,
    session: { current: 1, total: 1 },
  };
}

function openExample(key: ExampleKey): void {
  const exercise = getExerciseDefinition(EXAMPLES[key].exerciseId);
  if (!exercise) throw new Error(`Missing experiment exercise: ${EXAMPLES[key].exerciseId}`);
  selected = key;
  state = createState(locale, exercise);
  render();
}

function closeExample(): void {
  selected = null;
  state = null;
  render();
}

function render(): void {
  document.documentElement.lang = locale;
  if (!selected || !state) {
    root.innerHTML = launcher();
    return;
  }
  root.innerHTML = renderApp(state, 0, true, context());
}

root.addEventListener('click', (event) => {
  const raw = event.target;
  const el = raw instanceof Element ? raw : raw instanceof Node ? raw.parentElement : null;
  const button = el?.closest<HTMLElement>('[data-action]');
  if (!button) return;
  const action = button.dataset.action;

  if (action === 'visual-example') {
    const key = button.dataset.example as ExampleKey | undefined;
    if (key && key in EXAMPLES) openExample(key);
    return;
  }

  if (!state) return;

  if (action === 'session-exit' || action === 'next') {
    closeExample();
    return;
  }

  if (action === 'select-choice') {
    const choiceId = button.dataset.choiceId;
    if (choiceId) state = selectClassificationChoice(state, choiceId);
    render();
    return;
  }

  if (action === 'check-classification') {
    state = checkClassification(state);
    render();
    return;
  }

  if (action === 'select-evaluation-prediction') {
    state = selectEvaluationPrediction(state, button.dataset.value === 'true');
    render();
    return;
  }

  if (action === 'check-evaluation') {
    state = checkEvaluation(state);
    render();
    return;
  }

  if (action === 'submit-cell-value') {
    state = submitCellValue(state, button.dataset.value === 'true');
    render();
    return;
  }

  if (action === 'try-again') {
    state = tryAgainPractice(state);
    render();
    return;
  }

  if (action === 'show-hint') {
    state = showHint(state);
    render();
  }
});

render();
