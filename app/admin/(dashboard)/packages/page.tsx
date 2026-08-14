import { getAllServicesAdmin } from '@/services/packages.service';
import AdminPackagesManager from '@/components/admin/AdminPackagesManager';

export const revalidate = 0; // Dynamic admin data

export default async function AdminPackagesPage() {
  const services = await getAllServicesAdmin();

  // Parse features JSON safely for each service
  const serializedServices = services.map((s) => ({
    ...s,
    features: s.features,
  }));

  return (
    <div className="max-w-7xl mx-auto">
      <AdminPackagesManager initialServices={serializedServices} />
    </div>
  );
}
