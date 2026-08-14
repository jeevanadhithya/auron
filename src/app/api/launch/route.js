import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Map of recognized app names to Windows commands
export const APP_COMMANDS = {
  // Calculators & Math
  'calculator': 'start calc',
  'calc': 'start calc',

  // Control Panel & Settings
  'control panel': 'control',
  'control': 'control',
  'settings': 'start ms-settings:',
  'system settings': 'start ms-settings:',
  'display settings': 'start ms-settings:display',
  'network settings': 'start ms-settings:network',
  'bluetooth': 'start ms-settings:bluetooth',
  'sound settings': 'start ms-settings:sound',
  'privacy settings': 'start ms-settings:privacy',

  // System Tools
  'task manager': 'taskmgr',
  'taskmgr': 'taskmgr',
  'file explorer': 'start explorer',
  'explorer': 'start explorer',
  'notepad': 'start notepad',
  'paint': 'start mspaint',
  'mspaint': 'start mspaint',
  'wordpad': 'start wordpad',
  'snipping tool': 'start snippingtool',
  'snip': 'start snippingtool',
  'magnifier': 'start magnify',
  'on-screen keyboard': 'start osk',
  'narrator': 'start narrator',

  // Terminal & Command
  'command prompt': 'cmd',
  'cmd': 'cmd',
  'powershell': 'powershell',
  'terminal': 'wt',

  // Microsoft Office / Apps
  'notepad++': 'start notepad',
  'clock': 'start ms-clock:',
  'calendar': 'start outlookcal:',
  'maps': 'start bingmaps:',
  'camera': 'start microsoft.windows.camera:',
  'photos': 'start ms-photos:',
  'store': 'start ms-windows-store:',
  'xbox': 'start xbox:',
  'mail': 'start outlookmail:',
  'weather': 'start bingweather:',
  'news': 'start bingnews:',
  'alarms': 'start ms-clock:',
  'sticky notes': 'start stickynotes:',
  'voice recorder': 'start ms-callrecording:',

  // System Info
  'about windows': 'winver',
  'winver': 'winver',
  'system info': 'msinfo32',
  'disk management': 'diskmgmt.msc',
  'device manager': 'devmgmt.msc',
  'registry editor': 'regedit',
  'services': 'services.msc',
  'event viewer': 'eventvwr',
  'resource monitor': 'resmon',
  'performance monitor': 'perfmon',

  // Browsers
  'chrome': 'start chrome',
  'edge': 'start msedge',
  'browser': 'start msedge',
};

export function findCommand(appName) {
  const lower = appName.toLowerCase().trim();
  // Direct match
  if (APP_COMMANDS[lower]) return APP_COMMANDS[lower];
  // Partial match
  for (const [key, cmd] of Object.entries(APP_COMMANDS)) {
    if (lower.includes(key) || key.includes(lower)) return cmd;
  }
  return null;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { app } = body;

    if (!app || typeof app !== 'string') {
      return Response.json({ error: 'App name is required.' }, { status: 400 });
    }

    const command = findCommand(app);

    if (!command) {
      return Response.json({
        success: false,
        message: `I don't know how to open "${app}". Try: calculator, control panel, notepad, task manager, file explorer, settings, etc.`
      });
    }

    // Execute the command on the Windows system
    await execAsync(command, { shell: true, timeout: 5000 });

    return Response.json({
      success: true,
      message: `Launching ${app}...`,
      command
    });

  } catch (error) {
    // Some commands (like ms-settings: or explorer) throw even on success or exit cleanly
    if (error.code === 0 || error.killed === false) {
      return Response.json({ success: true, message: 'Application launched.' });
    }
    console.error('Launch error:', error);
    return Response.json({
      success: false,
      message: `Could not launch: ${error.message}`
    }, { status: 500 });
  }
}

