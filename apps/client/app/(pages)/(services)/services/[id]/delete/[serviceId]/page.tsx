import { redirect } from 'next/navigation';

import { APP_ROUTES } from '@/lib/types/types';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DeleteService({ params }: Props) {
  const { id } = await params;
  redirect(APP_ROUTES.SERVICES.MAIN(id));
}
