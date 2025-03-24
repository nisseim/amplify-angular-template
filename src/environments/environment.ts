export const environment = {
  production: false,
  password: (window as any)._env_?.PASSWORD || 'default-password',
  liffid: (window as any)._env_?.LIFFID || 'default-liffid',
  liffid2: (window as any)._env_?.LIFFID2 || 'default-liffid2',
  liffid3: (window as any)._env_?.LIFFID3 || 'default-liffid3',
};
