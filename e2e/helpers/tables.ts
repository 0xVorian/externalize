import { expect, type Locator, type Page } from '@playwright/test';

const ALIGN_TOLERANCE_PX = 8;

export type CellBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
};

export async function expectNoPageOverflow(page: Page): Promise<void> {
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
  ).toBe(true);
}

export async function readTableLayout(table: Locator): Promise<{
  header: CellBox[];
  body: CellBox[][];
}> {
  return table.evaluate((el) => {
    const box = (node: Element) => {
      const r = node.getBoundingClientRect();
      const visible = node.cloneNode(true) as HTMLElement;
      visible.querySelectorAll('.sr-only').forEach((el) => el.remove());
      return {
        x: r.x,
        y: r.y,
        width: r.width,
        height: r.height,
        text: visible.innerText.replace(/\s+/g, ' ').trim(),
      };
    };
    const headerRow = el.querySelector('thead tr');
    const header = headerRow ? [...headerRow.children].map(box) : [];
    const body = [...el.querySelectorAll('tbody tr')].map((row) =>
      [...row.children].map(box),
    );
    return { header, body };
  });
}

/** Header and body share one rectangular grid: cells in a row share a y, columns share an x. */
export async function expectAlignedTable(table: Locator): Promise<void> {
  const layout = await readTableLayout(table);
  expect(layout.header.length, 'header should have at least two columns').toBeGreaterThan(1);
  expect(layout.body.length, 'table should have body rows').toBeGreaterThan(0);

  const headerY = layout.header[0]!.y;
  for (const cell of layout.header) {
    expect(Math.abs(cell.y - headerY)).toBeLessThanOrEqual(ALIGN_TOLERANCE_PX);
  }
  for (let i = 1; i < layout.header.length; i += 1) {
    expect(layout.header[i]!.x).toBeGreaterThan(layout.header[i - 1]!.x);
  }

  for (const row of layout.body) {
    expect(row.length).toBe(layout.header.length);
    const rowY = row[0]!.y;
    for (let i = 0; i < row.length; i += 1) {
      expect(Math.abs(row[i]!.y - rowY)).toBeLessThanOrEqual(ALIGN_TOLERANCE_PX);
      expect(Math.abs(row[i]!.x - layout.header[i]!.x)).toBeLessThanOrEqual(ALIGN_TOLERANCE_PX);
      if (i > 0) {
        expect(row[i]!.x).toBeGreaterThan(row[i - 1]!.x);
      }
    }
  }
}
