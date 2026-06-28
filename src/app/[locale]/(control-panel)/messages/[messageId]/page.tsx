// app/[lang]/admin/messages/[messageId]/page.tsx
import MessageDetailsView from 'src/sections/admin-dashboard/messages/message-details/message-details-view';

interface Props {
  params: Promise<{ messageId: string }>;
}

export default async function Page({ params }: Props) {
  const { messageId } = await params;

  return <MessageDetailsView messageId={messageId} />;
}