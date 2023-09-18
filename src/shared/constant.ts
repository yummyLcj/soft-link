import * as os from 'os';

export const separator = os.platform() === 'win32' ? '\\' : '/';
