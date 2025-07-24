use client
import { Button } from '@/components/molecules/Button';
import { memo } from 'react';
import IconFake from '@/svg/IconFake';

const AuthenticatedNavigationBar = memo(() => {
  return (
    <header className="flex items-center justify-between w-full min-h-[72px] px-8 py-5 bg-yellow-20 border-b border-primary">
      <div className="flex items-center">
        <IconFake className="w-[43px] h-[32px] shrink-0" aria-label="Logo" />
      </div>
      <div className="flex items-center gap-2">
        <IconFake className="w-[24px] h-[24px]" aria-label="Help" />
        <Button
          label="Logout"
          icon={<IconFake className="w-[18px] h-[18px]" aria-label="SignOut" />}
          variant="secondary-signin"
          className="border border-tertiary bg-tertiary rounded-s h-8 px-3 py-1 flex items-center gap-0.5"
          ariaLabel="Logout"
        />
      </div>
    </header>
  );
});

export default AuthenticatedNavigationBar;