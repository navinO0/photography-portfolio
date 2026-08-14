export function getTenantId(): string {
  const tenantId = process.env.TENANT_ID || 'tenant_001';
  if (!tenantId) {
    throw new Error('TENANT_ID environment variable is missing.');
  }
  return tenantId;
}
