use client
import { Button } from '@/components/molecules/Button';
import { IconFake } from '@/svg/IconFake';

export default function UserNavigationBar() {
  return (
    <header className="flex items-center justify-between w-full min-h-[72px] px-8 py-5 bg-elevated border-b border-primary">
      <div className="flex items-center shrink-0 w-[43px] h-[32px]">
        <IconFake className="w-full h-full" />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center w-[24px] h-[24px]">
          <IconFake className="w-full h-full" />
        </div>
        <Button
          label="Logout"
          icon={<IconFake className="w-[18px] h-[18px]" />}
          variant="secondary-signin"
          className="border border-tertiary bg-accent rounded-s px-3 py-1.5 gap-[2px] h-[32px]"
          ariaLabel="Logout"
        />
      </div>
    </header>
  );
}
