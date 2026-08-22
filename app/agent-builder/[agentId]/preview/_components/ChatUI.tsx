'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, RefreshCw, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Agent } from '@/types/Agent';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  agentDetail?: Agent;
  conversationId: string;
  loading: boolean;
  generateToolConfig: () => void;
}

function ChatUI({ agentDetail, conversationId, loading, generateToolConfig }: Props) {
  const [userInput, setUserInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessage, setLoadingMessage] = useState<boolean>(false);

  const onSendMessage = async () => {
    if (!userInput.trim() || loadingMessage) return;

    const currentInput = userInput;
    setUserInput('');

    // 1. Append user query & initialize empty assistant chunk container
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: currentInput },
      { role: 'assistant', content: '' },
    ]);
    setLoadingMessage(true);

    try {
      // 2. Fetch streaming execution response from agent-chat endpoint
      const response = await fetch('/api/agent-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentName: agentDetail?.name || 'AI Agent',
          agents: agentDetail?.agentToolConfig?.agents || [],
          tools: agentDetail?.agentToolConfig?.tools || [],
          userInput: currentInput,
          conversationId: conversationId,
        }),
      });

      if (!response.body) {
        setLoadingMessage(false);
        return;
      }

      // 3. Read stream chunks and update UI in real-time
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value);
          setMessages((prev) => {
            const updated = [...prev];
            const lastIndex = updated.length - 1;
            updated[lastIndex] = {
              ...updated[lastIndex],
              content: updated[lastIndex].content + chunk,
            };
            return updated;
          });
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        updated[lastIndex] = {
          role: 'assistant',
          content: '⚠️ Something went wrong while executing the agent flow.',
        };
        return updated;
      });
    } finally {
      setLoadingMessage(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className='flex flex-col h-full'>
      {/* Chat Header */}
      <div className='p-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50'>
        <div>
          <h2 className='font-bold text-sm text-gray-800'>
            {agentDetail?.name || 'Agent Chat'}
          </h2>
          <p className='text-[11px] text-gray-500'>Live Preview Mode</p>
        </div>
        <Button
          variant='ghost'
          size='icon'
          onClick={generateToolConfig}
          disabled={loading}
          title='Reboot Agent'
          className='cursor-pointer'
        >
          <RefreshCw className={`w-4 h-4 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Messages Scroll Area */}
      <div className='flex-1 overflow-y-auto p-4 flex flex-col gap-3'>
        {messages.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-full text-gray-400 text-xs text-center'>
            <p>Start a conversation to test your agent flow.</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white self-end rounded-br-none'
                  : 'bg-gray-100 text-gray-800 self-start rounded-bl-none prose prose-xs max-w-none'
              }`}
            >
              {msg.role === 'assistant' && msg.content === '' && loadingMessage ? (
                <div className='flex items-center gap-1 py-1'>
                  <span className='w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]' />
                  <span className='w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]' />
                  <span className='w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce' />
                </div>
              ) : (
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              )}
            </div>
          ))
        )}
      </div>

      {/* Message Input & Action Bar */}
      <div className='p-3 border-t border-gray-100 flex items-center gap-2 bg-white'>
        <Textarea
          rows={1}
          placeholder='Type a message...'
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className='resize-none min-h-10 text-xs'
        />
        <Button
          size='icon'
          onClick={onSendMessage}
          disabled={loadingMessage || !userInput.trim()}
          className='cursor-pointer shrink-0'
        >
          {loadingMessage ? (
            <Loader2 className='w-4 h-4 animate-spin' />
          ) : (
            <Send className='w-4 h-4' />
          )}
        </Button>
      </div>
    </div>
  );
}

export default ChatUI;