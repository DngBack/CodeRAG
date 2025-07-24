"use client"
import { Button } from '@/components/molecules/Button';
import { Divider } from '@/components/atoms/Divider';
import { Text } from '@/components/atoms/Text';
import IconFake from '@/svg/IconFake';

export default function SignUpOptionsPanel() {
  return (
    <div className="flex flex-col gap-xxxxxl w-full max-w-[640px] mx-auto items-start">
      <div className="flex flex-col gap-xxxl w-full items-center">
        <div className="w-[182px] h-[135px] flex items-center justify-center">
          <IconFake className="w-full h-full" />
        </div>
        <div className="flex flex-col gap-m w-full items-center">
          <Text variant="xxl-bold-center-primary" as="h1" className="w-full">Welcome to Shank</Text>
          <Text variant="s-medium-secondary" as="p" className="w-full">You can sign up using your email address or by connecting with various accounts.</Text>
        </div>
      </div>
      <div className="flex flex-col gap-xxxxl w-full items-start">
        <div className="flex flex-col gap-m w-full items-start">
          <Button label="Sign up with Email" variant="tertiary-mail" icon={<IconFake className="w-lg h-lg" />} className="w-full" />
          <Button label="Sign up with Google" variant="tertiary-google" icon={<IconFake className="w-lg h-lg" />} className="w-full" />
          <Button label="Sign up with Apple" variant="tertiary-apple" icon={<IconFake className="w-lg h-lg" />} className="w-full" />
        </div>
        <div className="flex items-center gap-m w-full">
          <Divider className="flex-1" />
          <Text variant="m-bold-secondary">Or</Text>
          <Divider className="flex-1" />
        </div>
        <Button label="Sign In" variant="secondary-signin" className="w-full" />
      </div>
    </div>
  );
}
