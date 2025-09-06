import { deleteService } from '@/lib/actions/services';
import { APP_ROUTES, HANDLERS_ID } from '@/lib/types/types';
import { redirect } from 'next/navigation';

const handleCloseSlotModal = (router: any) => () => {
  router.back();
};

const handleDeleteService = (router: any, props: any) => async () => {
  const { salonId, serviceId } = props;
  const { data } = await deleteService(salonId, serviceId);

  if (data) {
    router.back();
    redirect(APP_ROUTES.SERVICES.MAIN(salonId));
  }
};

const handlers = {
  [HANDLERS_ID.CLOSE_SLOT_MODAL]: handleCloseSlotModal,
  [HANDLERS_ID.DELETE_SERVICE]: handleDeleteService,
};

export const getHandler = (handlerID: HANDLERS_ID) => handlers[handlerID];
