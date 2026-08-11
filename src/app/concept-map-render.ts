import type { Locale } from '../i18n';
import type { ProgressStore } from './storage';
import {
  conceptLabel,
  conceptPrerequisites,
  PREREQUISITES_GRAPH,
} from './prerequisites';

type ConceptMapUiCopy = {
  heading: string;
  hint: string;
  completedLegend: string;
  availableLegend: string;
  lockedLegend: string;
  graphAria: string;
  statusListAria: string;
  statusFor: (label: string, status: ConceptStatus) => string;
};

const CONCEPT_MAP_UI: Record<Locale, ConceptMapUiCopy> = {
  en: {
    heading: 'Concept map',
    hint: 'Concepts build on one another. Arrows show prerequisites.',
    completedLegend: 'Completed',
    availableLegend: 'Available',
    lockedLegend: 'Locked',
    graphAria: 'Prerequisite graph of course concepts',
    statusListAria: 'Concept completion status',
    statusFor: (label, status) =>
      status === 'completed'
        ? `${label}: completed`
        : status === 'available'
          ? `${label}: available`
          : `${label}: locked`,
  },
  fr: {
    heading: 'Carte des concepts',
    hint: "Les concepts s'enchaînent. Les flèches indiquent les prérequis.",
    completedLegend: 'Terminé',
    availableLegend: 'Disponible',
    lockedLegend: 'Verrouillé',
    graphAria: 'Graphe des prérequis entre concepts du cours',
    statusListAria: 'État d\'avancement des concepts',
    statusFor: (label, status) =>
      status === 'completed'
        ? `${label} : terminé`
        : status === 'available'
          ? `${label} : disponible`
          : `${label} : verrouillé`,
  },
};

type ConceptStatus = 'completed' | 'available' | 'locked';

type ConceptLayoutNode = {
  id: string;
  label: string;
  status: ConceptStatus;
  layer: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

type ConceptEdge = {
  from: string;
  to: string;
};

const NODE_MIN_WIDTH = 108;
const NODE_MAX_WIDTH = 148;
const NODE_HEIGHT = 40;
const NODE_PAD_X = 10;
const LAYER_GAP_Y = 56;
const NODE_GAP_X = 14;
const GRAPH_PAD = 16;
const CHAR_WIDTH = 6.2;

function lessonsForConcept(conceptId: string): string[] {
  return PREREQUISITES_GRAPH.lessons.filter((lesson) => lesson.concept === conceptId).map((l) => l.id);
}

function exercisesForConcept(conceptId: string): string[] {
  return PREREQUISITES_GRAPH.exercises
    .filter((exercise) => exercise.concept === conceptId)
    .map((e) => e.id);
}

function prerequisitesMet(store: ProgressStore, conceptId: string): boolean {
  return conceptPrerequisites(conceptId).every((req) => isConceptCompleted(store, req));
}

export function isConceptCompleted(store: ProgressStore, conceptId: string): boolean {
  const lessons = lessonsForConcept(conceptId);
  if (lessons.length > 0) {
    return lessons.every((id) => store.lessonsCompleted.includes(id));
  }
  const exercises = exercisesForConcept(conceptId);
  if (exercises.length > 0) {
    return exercises.every((id) => store.passed.includes(id));
  }
  return prerequisitesMet(store, conceptId);
}

export function conceptStatus(store: ProgressStore, conceptId: string): ConceptStatus {
  if (isConceptCompleted(store, conceptId)) return 'completed';
  if (!prerequisitesMet(store, conceptId)) return 'locked';
  return 'available';
}

function computeLayers(): Map<string, number> {
  const layers = new Map<string, number>();
  const visit = (id: string): number => {
    const cached = layers.get(id);
    if (cached !== undefined) return cached;
    const reqs = conceptPrerequisites(id);
    const layer = reqs.length === 0 ? 0 : Math.max(...reqs.map(visit)) + 1;
    layers.set(id, layer);
    return layer;
  };
  for (const concept of PREREQUISITES_GRAPH.concepts) visit(concept.id);
  return layers;
}

function nodeWidth(label: string): number {
  const longestLine = wrapLabel(label).reduce((max, line) => Math.max(max, line.length), 0);
  const width = longestLine * CHAR_WIDTH + NODE_PAD_X * 2;
  return Math.min(NODE_MAX_WIDTH, Math.max(NODE_MIN_WIDTH, Math.ceil(width)));
}

function wrapLabel(label: string, maxChars = 16): string[] {
  const words = label.split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars) {
      current = next;
      continue;
    }
    if (current) lines.push(current);
    current = word.length > maxChars ? `${word.slice(0, maxChars - 1)}…` : word;
  }
  if (current) lines.push(current);
  return lines.length > 0 ? lines.slice(0, 2) : [label];
}

function buildEdges(): ConceptEdge[] {
  const edges: ConceptEdge[] = [];
  for (const concept of PREREQUISITES_GRAPH.concepts) {
    for (const req of concept.requires ?? []) {
      edges.push({ from: req, to: concept.id });
    }
  }
  return edges;
}

function buildLayout(locale: Locale, store: ProgressStore): {
  nodes: ConceptLayoutNode[];
  edges: ConceptEdge[];
  width: number;
  height: number;
} {
  const layers = computeLayers();
  const byLayer = new Map<number, string[]>();
  for (const concept of PREREQUISITES_GRAPH.concepts) {
    const layer = layers.get(concept.id) ?? 0;
    const bucket = byLayer.get(layer) ?? [];
    bucket.push(concept.id);
    byLayer.set(layer, bucket);
  }

  const nodes: ConceptLayoutNode[] = [];
  let graphWidth = 0;
  let maxLayer = 0;

  for (const [layer, ids] of [...byLayer.entries()].sort(([a], [b]) => a - b)) {
    maxLayer = Math.max(maxLayer, layer);
    const widths = ids.map((id) => nodeWidth(conceptLabel(locale, id)));
    const rowWidth =
      widths.reduce((sum, w) => sum + w, 0) + Math.max(0, ids.length - 1) * NODE_GAP_X;
    graphWidth = Math.max(graphWidth, rowWidth);
    let x = 0;
    ids.forEach((id, index) => {
      const width = widths[index]!;
      nodes.push({
        id,
        label: conceptLabel(locale, id),
        status: conceptStatus(store, id),
        layer,
        x: x + width / 2,
        y: GRAPH_PAD + layer * (NODE_HEIGHT + LAYER_GAP_Y) + NODE_HEIGHT / 2,
        width,
        height: NODE_HEIGHT,
      });
      x += width + NODE_GAP_X;
    });
  }

  for (const node of nodes) {
    const row = byLayer.get(node.layer) ?? [];
    const widths = row.map((id) => nodeWidth(conceptLabel(locale, id)));
    const rowWidth =
      widths.reduce((sum, w) => sum + w, 0) + Math.max(0, row.length - 1) * NODE_GAP_X;
    const offset = (graphWidth - rowWidth) / 2;
    const index = row.indexOf(node.id);
    let x = offset;
    for (let i = 0; i < index; i++) x += widths[i]! + NODE_GAP_X;
    node.x = x + widths[index]! / 2;
  }

  const height = GRAPH_PAD * 2 + (maxLayer + 1) * NODE_HEIGHT + maxLayer * LAYER_GAP_Y;
  return {
    nodes,
    edges: buildEdges(),
    width: graphWidth + GRAPH_PAD * 2,
    height,
  };
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderNode(node: ConceptLayoutNode): string {
  const lines = wrapLabel(node.label);
  const lineHeight = 14;
  const textY = node.y - ((lines.length - 1) * lineHeight) / 2;
  const textLines = lines
    .map(
      (line, index) =>
        `<tspan x="${node.x}" dy="${index === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`,
    )
    .join('');
  const left = node.x - node.width / 2;
  const top = node.y - node.height / 2;
  return `
    <g class="concept-map-node concept-map-node-${node.status}" data-concept-id="${escapeXml(node.id)}">
      <title>${escapeXml(node.label)}</title>
      <rect
        x="${left.toFixed(1)}"
        y="${top.toFixed(1)}"
        width="${node.width.toFixed(1)}"
        height="${node.height.toFixed(1)}"
        rx="8"
        ry="8"
      />
      <text class="concept-map-node-label" x="${node.x.toFixed(1)}" y="${textY.toFixed(1)}" text-anchor="middle">${textLines}</text>
    </g>`;
}

function renderEdge(
  edge: ConceptEdge,
  nodes: Map<string, ConceptLayoutNode>,
): string {
  const from = nodes.get(edge.from);
  const to = nodes.get(edge.to);
  if (!from || !to) return '';
  const x1 = from.x;
  const y1 = from.y + from.height / 2;
  const x2 = to.x;
  const y2 = to.y - to.height / 2;
  const midY = (y1 + y2) / 2;
  return `<path class="concept-map-edge" d="M ${x1.toFixed(1)} ${y1.toFixed(1)} C ${x1.toFixed(1)} ${midY.toFixed(1)}, ${x2.toFixed(1)} ${midY.toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}" marker-end="url(#concept-map-arrow)" />`;
}

function renderLegend(copy: ConceptMapUiCopy): string {
  return `
    <ul class="concept-map-legend">
      <li><span class="concept-map-swatch concept-map-node-completed" aria-hidden="true"></span>${copy.completedLegend}</li>
      <li><span class="concept-map-swatch concept-map-node-available" aria-hidden="true"></span>${copy.availableLegend}</li>
      <li><span class="concept-map-swatch concept-map-node-locked" aria-hidden="true"></span>${copy.lockedLegend}</li>
    </ul>`;
}

function renderStatusList(locale: Locale, store: ProgressStore, copy: ConceptMapUiCopy): string {
  const items = PREREQUISITES_GRAPH.concepts
    .map((concept) => {
      const label = conceptLabel(locale, concept.id);
      const status = conceptStatus(store, concept.id);
      return `<li>${escapeXml(copy.statusFor(label, status))}</li>`;
    })
    .join('');
  return `
    <ul class="concept-map-status-list" aria-label="${escapeXml(copy.statusListAria)}">
      ${items}
    </ul>`;
}

function renderConceptGraph(locale: Locale, store: ProgressStore): string {
  const copy = CONCEPT_MAP_UI[locale];
  const layout = buildLayout(locale, store);
  const nodeById = new Map(layout.nodes.map((node) => [node.id, node]));
  const edges = layout.edges.map((edge) => renderEdge(edge, nodeById)).join('');
  const nodes = layout.nodes.map(renderNode).join('');
  return `
    <div class="concept-map-graph-wrap">
      <svg
        class="concept-map-graph"
        viewBox="0 0 ${layout.width.toFixed(1)} ${layout.height.toFixed(1)}"
        role="img"
        aria-hidden="true"
        preserveAspectRatio="xMidYMin meet"
      >
        <defs>
          <marker
            id="concept-map-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
        </defs>
        <g class="concept-map-edges">${edges}</g>
        <g class="concept-map-nodes">${nodes}</g>
      </svg>
      ${renderStatusList(locale, store, copy)}
      ${renderLegend(copy)}
    </div>`;
}

export function renderConceptMap(locale: Locale, store: ProgressStore): string {
  const copy = CONCEPT_MAP_UI[locale];
  return `
    <details class="progress-card progress-disclosure concept-map-card">
      <summary>
        <span class="panel-title">${copy.heading}</span>
        <span class="progress-summary-meta">${copy.hint}</span>
      </summary>
      <div class="progress-disclosure-body">${renderConceptGraph(locale, store)}</div>
    </details>`;
}
