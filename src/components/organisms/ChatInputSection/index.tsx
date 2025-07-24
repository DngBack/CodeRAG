"use client"
import { useState, memo } from 'react';
import { TextField } from '@/components/molecules/TextField';
import { Button } from '@/components/molecules/Button';
import { IconFake } from '@/svg/IconFake';

const ChatInputSection = memo(() => {
  const [inputValue, setInputValue] = useState('');

  return (
    <section
      className="flex items-center gap-m w-full border-t border-primary bg-screen px-xxxxl py-xxxl"
      style={{ minHeight: '64px' }}
    >
      <TextField
        placeholder="Hello!"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        className="flex-1 h-2xl border border-tertiary bg-tertiary rounded-s px-xxl py-xl"
      />
      <Button
        label="Send"
        variant="disabled-upload"
        icon={<IconFake className="w-lg h-lg" />}
        ariaLabel="Send message"
      />
    </section>
  );
});

ChatInputSection.displayName = 'ChatInputSection';

export { ChatInputSection };