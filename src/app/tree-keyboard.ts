export type TreeNavDirection = 'next' | 'prev' | 'parent' | 'firstChild' | 'first' | 'last';

export function getTreeItemButtons(treeRoot: Element): HTMLButtonElement[] {
  return Array.from(treeRoot.querySelectorAll<HTMLButtonElement>('button[data-action="select-node"]'));
}

function getTreeItemForButton(button: HTMLButtonElement): HTMLElement | null {
  return button.closest('[role="treeitem"]');
}

function getParentTreeItem(item: HTMLElement): HTMLElement | null {
  return item.parentElement?.closest('[role="treeitem"]') ?? null;
}

function getFirstChildTreeItem(item: HTMLElement): HTMLElement | null {
  const group = item.querySelector(':scope > [role="group"]');
  if (!group) return null;
  return group.querySelector(':scope > [role="treeitem"]');
}

function getAllTreeItems(treeRoot: Element): HTMLElement[] {
  return Array.from(treeRoot.querySelectorAll('[role="treeitem"]'));
}

function buttonForTreeItem(item: HTMLElement | undefined): HTMLButtonElement | null {
  if (!item) return null;
  return item.querySelector('button[data-action="select-node"]');
}

export function roveTabindex(focusedButton: HTMLButtonElement): void {
  const treeRoot = focusedButton.closest('[role="tree"]');
  if (!treeRoot) return;
  for (const button of getTreeItemButtons(treeRoot)) {
    button.tabIndex = button === focusedButton ? 0 : -1;
  }
}

export function navigateTree(fromButton: HTMLButtonElement, direction: TreeNavDirection): HTMLButtonElement | null {
  const item = getTreeItemForButton(fromButton);
  const treeRoot = fromButton.closest('[role="tree"]');
  if (!item || !treeRoot) return null;
  const allItems = getAllTreeItems(treeRoot);
  const index = allItems.indexOf(item);
  switch (direction) {
    case 'next': return buttonForTreeItem(allItems[index + 1]);
    case 'prev': return buttonForTreeItem(allItems[index - 1]);
    case 'parent': return buttonForTreeItem(getParentTreeItem(item) ?? undefined);
    case 'firstChild': return buttonForTreeItem(getFirstChildTreeItem(item) ?? undefined);
    case 'first': return buttonForTreeItem(allItems[0]);
    case 'last': return buttonForTreeItem(allItems[allItems.length - 1]);
  }
}

const KEY_DIRECTION: Record<string, TreeNavDirection> = {
  ArrowDown: 'next', ArrowUp: 'prev', ArrowRight: 'firstChild', ArrowLeft: 'parent', Home: 'first', End: 'last',
};

export function handleTreeKeydown(event: KeyboardEvent): boolean {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement) || target.dataset.action !== 'select-node') return false;
  const direction = KEY_DIRECTION[event.key];
  if (!direction) return false;
  const next = navigateTree(target, direction);
  if (!next || next === target) return false;
  roveTabindex(next);
  next.focus();
  return true;
}

export function treeFocusNodeId(state: { exercise: { type: string }; selectedNodeId: string | null; tree: { id: string } }): string | undefined {
  if (state.exercise.type !== 'identify-main-connective') return undefined;
  return state.selectedNodeId ?? state.tree.id;
}
