import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const HOST = 'localhost';
const PORT = Number(process.env.PLAYWRIGHT_ACCOUNTS_PORT ?? 8788);

let child: ChildProcess | undefined;
let started = false;

export function accountsBaseURL(): string {
  return `http://${HOST}:${PORT}`;
}

export async function startAccountsServer(): Promise<string> {
  if (started) {
    return accountsBaseURL();
  }

  const dist = resolve(process.cwd(), 'dist/index.html');
  if (!existsSync(dist)) {
    await run('npm', ['run', 'build']);
  }
  await run('npx', [
    'wrangler',
    'd1',
    'migrations',
    'apply',
    'externalize-progress',
    '--local',
  ]);

  child = spawn(
    'npx',
    [
      'wrangler',
      'pages',
      'dev',
      'dist',
      '--ip',
      '0.0.0.0',
      '--port',
      String(PORT),
    ],
    {
      cwd: process.cwd(),
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env },
    },
  );

  const output: string[] = [];
  child.stdout?.on('data', (chunk: Buffer) => {
    output.push(chunk.toString());
  });
  child.stderr?.on('data', (chunk: Buffer) => {
    output.push(chunk.toString());
  });
  let exitError: string | undefined;
  child.on('exit', (code) => {
    if (!started) {
      exitError = `wrangler pages dev exited early (${code ?? 'null'}):\n${output.join('')}`;
    }
  });

  await waitForAccounts(accountsBaseURL(), output, () => exitError);
  started = true;
  return accountsBaseURL();
}

export async function stopAccountsServer(): Promise<void> {
  if (!child) {
    return;
  }
  const current = child;
  child = undefined;
  started = false;
  current.kill('SIGTERM');
  await new Promise<void>((resolveExit) => {
    const timer = setTimeout(() => {
      current.kill('SIGKILL');
      resolveExit();
    }, 3000);
    current.once('exit', () => {
      clearTimeout(timer);
      resolveExit();
    });
  });
}

async function waitForAccounts(
  baseURL: string,
  output: string[],
  getExitError: () => string | undefined,
): Promise<void> {
  const deadline = Date.now() + 90_000;
  let lastError = '';
  while (Date.now() < deadline) {
    const exitError = getExitError();
    if (exitError) {
      throw new Error(exitError);
    }
    try {
      const response = await fetch(`${baseURL}/api/status`);
      if (response.ok) {
        const body = (await response.json()) as { available?: boolean };
        if (body.available === true) {
          return;
        }
        lastError = `status available=${String(body.available)}`;
      } else {
        lastError = `HTTP ${response.status}`;
      }
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
    await new Promise((resolveWait) => setTimeout(resolveWait, 250));
  }
  throw new Error(
    `Accounts server did not become ready at ${baseURL}/api/status (${lastError})\n${output.join('')}`,
  );
}

function run(command: string, args: string[]): Promise<void> {
  return new Promise((resolveRun, reject) => {
    const proc = spawn(command, args, {
      cwd: process.cwd(),
      stdio: 'inherit',
    });
    proc.on('exit', (code) => {
      if (code === 0) {
        resolveRun();
      } else {
        reject(new Error(`${command} ${args.join(' ')} exited ${code ?? 'null'}`));
      }
    });
  });
}
