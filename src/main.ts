import { parse, format, evaluateWithNodes } from '../engine';

const app = document.querySelector<HTMLDivElement>('#app')!;

const formula = parse('(P → Q) ↔ ¬R');
const assignment = { P: true, Q: false, R: true };
const { root, tree } = evaluateWithNodes(formula, assignment);

app.innerHTML = `
  <main style="font-family: system-ui; padding: 1rem; max-width: 24rem; margin: 0 auto;">
    <h1>Externalize</h1>
    <p>Engine spike — Phase 1</p>
    <p><strong>Formula:</strong> ${format(formula)}</p>
    <p><strong>Result:</strong> ${root ? 'true' : 'false'}</p>
    <pre style="font-size: 0.875rem; overflow-x: auto;">${JSON.stringify(tree, null, 2)}</pre>
  </main>
`;
