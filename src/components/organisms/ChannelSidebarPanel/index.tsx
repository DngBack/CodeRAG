"use client"
import { memo } from 'react';
import { Button } from '@/components/molecules/Button';
import { IconFake } from '@/svg/IconFake';

const channels = [
	{ label: 'General', variant: 'channel-secondary' },
	{ label: 'Project', variant: 'channel-secondary' },
	{ label: 'Random', variant: 'channel-secondary' },
	{ label: 'Research', variant: 'channel-primary' },
];

export const ChannelSidebarPanel = memo(function ChannelSidebarPanel() {
	return (
		<aside className="flex flex-col gap-6 min-h-screen w-[320px] px-8 py-6 bg-yellow-20 border-r border-primary">
			<div className="flex flex-col gap-0 w-full">
				{channels.map((channel) => (
					<Button
						key={channel.label}
						label={channel.label}
						icon={<IconFake className="w-[18px] h-[18px]" />}
						variant={channel.variant}
						className="w-full"
						ariaLabel={channel.label}
					/>
				))}
			</div>
			<Button
				label="Create Channel"
				icon={<IconFake className="w-[18px] h-[18px]" />}
				variant="tertiary-mail"
				className="w-full"
				ariaLabel="Create Channel"
			/>
		</aside>
	);
});

ChannelSidebarPanel.displayName = 'ChannelSidebarPanel';

// Thank you for your feedback. Please install 'react', 'react-dom', '@types/react', and '@types/react-dom' using npm or yarn. Check your tsconfig.json paths for alias resolution and ensure '@/components/molecules/Button' and '@/svg/IconFake' files exist. Confirm 'react/jsx-runtime' is available. Re-run lint and build after resolving these issues.
