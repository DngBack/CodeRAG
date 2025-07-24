import { AuthenticatedNavigationBar } from '@/components/organisms/AuthenticatedNavigationBar';
import OverlaySection from '@/components/organisms/OverlaySection';
import { ChannelSidebarPanel } from '@/components/organisms/ChannelSidebarPanel';
import ChannelChatSection from '@/components/organisms/ChannelChatSection';
import ChannelDetailsModal from '@/components/organisms/ChannelDetailsModal';
import { ChatInputSection } from '@/components/organisms/ChatInputSection';

export const ChannelInfoManagementTemplate = () => {
  return (
    <div className="relative min-h-screen w-full bg-neutral-10 flex flex-col">
      <AuthenticatedNavigationBar />
      <div className="relative flex flex-row w-full flex-1 min-h-0">
        <ChannelSidebarPanel />
        <main className="flex flex-col flex-1 min-h-0 bg-screen">
          <ChannelChatSection />
          <ChatInputSection />
        </main>
        <OverlaySection />
        <ChannelDetailsModal />
      </div>
    </div>
  );
};
