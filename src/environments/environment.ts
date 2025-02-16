export const environment = {
  production: false,
  password: (window as any)._env_?.PASSWORD || 'default-password',
  liffid: (window as any)._env_?.LIFFID || 'default-liffid',
};
