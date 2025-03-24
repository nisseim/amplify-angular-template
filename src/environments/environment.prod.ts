export const environment = {
  production: true,
  password: (window as any)._env_?.PASSWORD || 'default-password',
  liffId: (window as any)._env_?.LIFFID || 'default-liffId',
};
