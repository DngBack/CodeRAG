import { SignInSection } from '@/components/organisms/SignInSection';

export const SignInTemplate = () => {
  return (
    <div className="flex items-center justify-end min-h-screen w-full bg-neutral-10">
      <div className="flex flex-col items-center justify-center gap-xxxxxl w-full max-w-[731px]">
        <SignInSection />
      </div>
    </div>
  );
};
