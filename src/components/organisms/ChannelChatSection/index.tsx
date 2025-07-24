use client
import { memo } from 'react';
import { Text } from '@/components/atoms/Text';
import { Account } from '@/components/molecules/Account';
import IconFake from '@/svg/IconFake';

const ChannelChatSection = memo(function ChannelChatSection() {
  return (
    <section className="flex flex-col items-center gap-xxxxl min-h-screen w-full bg-screen">
      <header className="flex items-center justify-between w-full max-w-screen-xl h-20 px-8 border-b border-secondary bg-screen">
        <div className="flex items-center gap-s">
          <div className="flex items-center gap-xxxs">
            <div className="flex items-center">
              <IconFake className="w-8 h-8 bg-neutral-30 rounded" />
            </div>
            <Text variant="xl-bold-center-primary">Research</Text>
            <div className="flex items-center justify-center w-8 h-8">
              <IconFake className="w-8 h-8 bg-neutral-30 rounded" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-xs">
          <Account
            accounts={[
              { src: '/images/omid-armin.jpg', alt: 'Omid Armin', size: 'xl', className: 'rounded-s' },
              { src: '/images/renato-marques.jpg', alt: 'Renato Marques', size: 'xl', className: 'rounded-s' },
              { src: '/images/ben-iwara.jpg', alt: 'Ben Iwara', size: 'xl', className: 'rounded-s' },
            ]}
          />
          <Text variant="xs-bold-secondary-italic">72</Text>
        </div>
      </header>
      <div className="flex items-start gap-m w-full max-w-screen-xl">
        <Account
          accounts={[{ src: '/images/omid-armin.jpg', alt: 'Omid Armin', size: '2xl', className: 'rounded-s' }]}
        />
        <div className="flex flex-col gap-xxxxs w-full">
          <Text variant="xxs-bold-secondary-italic">Janet Wayne</Text>
          <Text variant="m-medium-primary-italic">Hello!</Text>
        </div>
      </div>
    </section>
  );
});

export default ChannelChatSection;
