'use client'

import { TextForm } from '@/components/molecules/TextForm';
import { Button } from '@/components/atoms/Button';
import { TextButton } from '@/components/molecules/TextButton';
import { IconFake } from '@/svg/IconFake';

export default function SignInSection() {
  return (
    <section className="flex flex-col items-center justify-center gap-xxxxxl w-full max-w-[731px] mx-auto min-h-screen p-8">
      <div className="flex w-full items-center justify-end">
        <div className="flex flex-col items-center gap-xxxl w-full">
          <div className="flex flex-col items-center gap-m w-full">
            <div className="flex items-center justify-center w-[182px] h-[135px]">
              <IconFake className="w-full h-full bg-neutral-20 rounded-s" />
            </div>
            <div className="flex flex-col gap-m w-full">
              <h1 className="w-full text-center text-xxl font-bold text-primary leading-[1] tracking-[0.8px] font-[K2D]">
                Sign in
              </h1>
              <p className="w-full text-center text-s font-medium text-secondary leading-[1.55] tracking-[0.48px] font-[K2D]">
                Please enter your email address and password.Please enter your email address and password.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-xxl w-full">
        <div className="flex flex-col gap-xxxxl w-full">
          <div className="flex flex-col gap-xl w-full">
            <TextForm
              label="Email"
              placeholder="Your Address"
              inputProps={{ type: 'email', autoComplete: 'email' }}
            />
            <TextForm
              label="Password"
              placeholder="Your Password"
              inputProps={{ type: 'password', autoComplete: 'current-password' }}
              icon={<IconFake className="w-xl h-xl bg-neutral-20 rounded-s" />}
            />
          </div>
          <Button as="button" className="w-full h-12 px-xxxl py-[14px] rounded-s bg-yellow-50 text-on-primary font-bold text-m leading-[1] tracking-[0.5px] font-[K2D]">
            Sign in
          </Button>
        </div>
        <TextButton
          icon={<IconFake className="w-[20px] h-[20px] bg-neutral-20 rounded-s" />}
          label="Back to Top"
          textVariant="s-bold-secondary"
          className="gap-xxxs px-0 py-0 bg-transparent shadow-none border-none"
        />
      </div>
    </section>
  );
}
