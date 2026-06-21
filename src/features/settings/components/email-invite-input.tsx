'use client';

import { useState, useRef } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from '@/components/ui/popover';
import { Mail, Plus, X } from 'lucide-react';

interface EmailInviteInputProps {
  emails: string[];
  onEmailsChange: (emails: string[]) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EmailInviteInput({
  emails,
  onEmailsChange,
}: EmailInviteInputProps) {
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const trimmed = input.trim();
  const isValidEmail = EMAIL_REGEX.test(trimmed);
  const isDuplicate = emails.includes(trimmed);

  const handleInputChange = (val: string) => {
    setInput(val);
    const trimmedVal = val.trim();
    setOpen(trimmedVal.length > 0 && trimmedVal.includes('@'));
  };

  const addEmail = (email: string) => {
    if (!isDuplicate && isValidEmail) {
      onEmailsChange([...emails, email]);
      setInput('');
      setOpen(false);
      inputRef.current?.focus();
    }
  };

  const removeEmail = (email: string) => {
    onEmailsChange(emails.filter((e) => e !== email));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && isValidEmail && !isDuplicate) {
      e.preventDefault();
      addEmail(trimmed);
    }
    if (e.key === 'Backspace' && !input && emails.length > 0) {
      onEmailsChange(emails.slice(0, -1));
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div
          className="flex flex-wrap items-center gap-1.5 rounded-lg border px-3 py-2 min-h-[72px] focus-within:border-ring focus-within:ring-1 focus-within:ring-ring/10 transition-colors cursor-text"
          onClick={() => inputRef.current?.focus()}
        >
          {emails.map((email) => (
            <span
              key={email}
              className="inline-flex items-center gap-1 rounded-md bg-muted pl-2 pr-1 py-1 text-xs font-medium animate-in fade-in-0 zoom-in-95"
            >
              {email}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeEmail(email);
                }}
                className="rounded-sm p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10 transition-colors cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={emails.length === 0 ? 'name@example.com' : ''}
            className="flex-1 min-w-[140px] bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </PopoverAnchor>

      <PopoverContent
        className="w-(--radix-popover-trigger-width) p-1 shadow-md"
        side="bottom"
        align="start"
        sideOffset={4}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {isValidEmail && !isDuplicate ? (
          <button
            type="button"
            onClick={() => addEmail(trimmed)}
            className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
              <Plus className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">
                Add <span className="text-primary">{trimmed}</span>
              </p>
            </div>
          </button>
        ) : isDuplicate ? (
          <div className="flex items-center gap-2 px-2.5 py-2 text-xs text-muted-foreground">
            <Mail className="h-3.5 w-3.5" />
            Already added
          </div>
        ) : (
          <div className="flex items-center gap-2 px-2.5 py-2 text-xs text-muted-foreground">
            <Mail className="h-3.5 w-3.5" />
            Enter a valid email
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
