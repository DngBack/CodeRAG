'use client'
import { memo } from 'react';
import { Tab } from '@/components/molecules/Tab';
import { Divider } from '@/components/atoms/Divider';
import { Button } from '@/components/molecules/Button';
import IconFake from '@/svg/IconFake';

const ChannelDetailsModal = memo(function ChannelDetailsModal() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-black bg-opacity-30">
      <div className="inline-flex flex-col gap-8 items-center bg-tertiary rounded-l shadow-[0px_115px_32px_0px_rgba(0,0,0,0),0px_74px_30px_0px_rgba(0,0,0,0.01),0px_42px_25px_0px_rgba(0,0,0,0.05),0px_18px_18px_0px_rgba(0,0,0,0.09),0px_5px_10px_0px_rgba(0,0,0,0.10)] pb-[32px] max-w-full w-[90vw] sm:w-[552px]">
        <div className="flex flex-col gap-8 w-full px-8 pt-8 pb-0 bg-tertiary border-b border-tertiary">
          <div className="flex items-end justify-between w-full">
            <span className="text-xxl font-bold italic tracking-[0.8px] text-primary font-english">#Research</span>
            <button type="button" className="w-xl h-xl flex items-center justify-center">
              <IconFake className="w-xl h-xl bg-neutral-20 rounded" />
            </button>
          </div>
          <div className="flex gap-6 items-start">
            <Tab label="Channel Info" active />
            <Tab label="Member" value={72} />
          </div>
        </div>
        <div className="flex flex-col gap-6 w-full px-8">
          <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-start justify-between w-full">
                <span className="text-m font-bold italic tracking-[0.5px] text-primary font-english">Name</span>
                <button type="button" className="w-lg h-lg flex items-center justify-center">
                  <IconFake className="w-lg h-lg bg-neutral-20 rounded" />
                </button>
              </div>
              <span className="text-s font-medium italic tracking-[0.48px] text-secondary font-english leading-[1.55]">Research</span>
            </div>
            <Divider />
          </div>
          <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-start justify-between w-full">
                <span className="text-m font-bold italic tracking-[0.5px] text-primary font-english">Description</span>
                <button type="button" className="w-lg h-lg flex items-center justify-center">
                  <IconFake className="w-lg h-lg bg-neutral-20 rounded" />
                </button>
              </div>
              <span className="text-s font-medium italic tracking-[0.48px] text-secondary font-english leading-[1.55]">A channel for sharing and discussing the latest research, articles, and papers on teleportation technology.</span>
            </div>
            <Divider />
          </div>
          <Button
            label="Delete Channel"
            icon={<IconFake className="w-[18px] h-[18px] bg-neutral-20 rounded" />}
            variant="tertiary-mail"
            className="w-full h-[40px] flex items-center justify-center gap-xxxxs px-xl py-s rounded-s bg-alert"
            ariaLabel="Delete Channel"
          />
        </div>
      </div>
    </div>
  );
});

export default ChannelDetailsModal;

/*
Please run 'npm install react react-dom @types/react @types/react-dom', verify your tsconfig.json 'paths' configuration for '@/...' imports, and ensure all referenced files exist before proceeding with code review or linting.
*/
