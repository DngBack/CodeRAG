import { SignUpOptionsPanel } from '@/components/organisms/SignUpOptionsPanel';

export const SignupOptionsTemplate = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-10">
      <div className="flex flex-col gap-xxxxxl w-full max-w-[640px] items-start">
        <SignUpOptionsPanel />
      </div>
    </div>
  );
};
