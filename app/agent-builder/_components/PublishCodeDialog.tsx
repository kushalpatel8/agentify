'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  agentId: string;
}

function PublishCodeDialog({ openDialog, setOpenDialog, agentId }: Props) {
  const [copied, setCopied] = useState(false);

  const embedCode = `// Call your deployed AI Agent with real-time streaming
const response = await fetch("https://your-domain.com/api/agent-sdk", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    agentId: "${agentId}",
    userId: "USER_UNIQUE_ID", // Unique ID for tracking user session
    userInput: "Hello! What can you do?",
  }),
});

const reader = response.body.getReader();
const decoder = new TextDecoder();
let done = false;

while (!done) {
  const { value, done: doneReading } = await reader.read();
  done = doneReading;
  if (value) {
    const chunk = decoder.decode(value);
    console.log(chunk); // Process streaming response in real-time
  }
}`;

  const onCopy = async () => {
    await navigator.clipboard.writeText(embedCode);
    setCopied(true);
    toast.success('Snippet copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className='max-w-2xl bg-white rounded-2xl p-6'>
        <DialogHeader>
          <DialogTitle className='text-lg font-bold'>Publish & Integrate Agent</DialogTitle>
          <DialogDescription className='text-xs text-gray-500'>
            Use this code snippet to embed this agent into your own React, Next.js, or Node.js application.
          </DialogDescription>
        </DialogHeader>

        {/* Code Snippet Container */}
        <div className='relative mt-3 rounded-xl bg-gray-900 p-4 font-mono text-xs text-gray-100 overflow-x-auto max-h-80'>
          <Button
            size='sm'
            variant='ghost'
            onClick={onCopy}
            className='absolute top-2 right-2 h-7 px-2 text-gray-400 hover:text-white hover:bg-gray-800 cursor-pointer'
          >
            {copied ? <Check className='w-3.5 h-3.5 text-green-400' /> : <Copy className='w-3.5 h-3.5' />}
            <span className='ml-1 text-[11px]'>{copied ? 'Copied' : 'Copy'}</span>
          </Button>

          <pre className='text-xs leading-relaxed'>{embedCode}</pre>
        </div>

        {/* Action Button */}
        <div className='flex justify-end mt-2'>
          <Button
            variant='outline'
            onClick={() => setOpenDialog(false)}
            className='cursor-pointer text-xs'
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PublishCodeDialog;