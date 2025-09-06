import { PageNav } from '@/components/PageNav/PageNav';
import { Box } from '@mui/material';

export default async function NotificationsList() {
  return (
    <Box>
      <PageNav title="Notifications" nav={true} />
    </Box>
  );
}
