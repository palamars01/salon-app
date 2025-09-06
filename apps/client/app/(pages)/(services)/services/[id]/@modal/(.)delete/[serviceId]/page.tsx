'use server';

import { checkRolePermission } from '@/lib/utils/utils';
import { DeleteServiceModal } from '../components/DeleteServiceModal/DeleteServiceModal';
import { RolesEnum } from '@repo/shared/enums';

interface Props {
  params: Promise<{ id: string; serviceId: string }>;
}

export default async function DeleteService({ params }: Props) {
  await checkRolePermission([RolesEnum.salon, RolesEnum.privateWorker]);
  const { id, serviceId } = await params;

  const [servId, name] = serviceId.split('_');
  return (
    <DeleteServiceModal
      serviceName={name!.replace(/%20/g, ' ')}
      salonId={id}
      serviceId={servId!}
    />
  );
}
