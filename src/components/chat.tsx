'use client';
import { scrollToBottom, initialMessages } from '@/lib/utils';
import { ChatLine } from './chat-line';
import { PromptSuggestion } from './prompt-suggestion';
import { useChat, Message } from 'ai/react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Spinner } from './ui/spinner';
import { FormEvent, useEffect, useRef, useState } from 'react';

export function Chat() {
  const suggestArray = [
    'Provide concise, accurate answers to user questions.',
    'Generate summary of key points, specific topics, or trends.'
  ];
  const [suggestions, setSuggestions] = useState([
    'Provide concise, accurate answers to user questions.',
    'Generate summary of key points, specific topics, or trends.'
  ]);

  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const queryRef = useRef<HTMLInputElement | null>(null);
  const submitRef = useRef<HTMLButtonElement | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [enterKeyPressed, setEnterKeyPressed] = useState(false);

  const {
    messages,
    setMessages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop
  } = useChat({
    initialMessages,
    onFinish() {
      setShowSuggestions(true);
      setTimeout(() => scrollToBottom(containerRef), 100);
    }
  });

  useEffect(() => {
    setTimeout(() => scrollToBottom(containerRef), 100);
    setEnterKeyPressed(false);
  }, [messages]);

  useEffect(() => {
    document.getElementById('chat')?.addEventListener('keypress', e => {
      if (e.key === 'Enter') {
        setEnterKeyPressed(true);
      }
    });
  }, []);

  const handleSuggestionClick = (text: string, index: number) => {
    if (enterKeyPressed) {
      setTimeout(() => setShowSuggestions(false), 0);
      return;
    }
    // setInput(text);
    setSelectedSuggestion(index);
    // setTimeout(() => {
    //   setShowSuggestions(false);
    //   // const newSuggestions = suggestions.filter((_s, i) => i !== index);
    //   // setSuggestions(newSuggestions);
    // }, 0);
  };

  const handleDelete = (id: string) => {
    setMessages(messages.filter(m => m.id !== id));
  };

  const handlePreSubmit = (e: FormEvent<HTMLButtonElement>) => {
    if (queryRef.current) {
      const currentValue = queryRef.current.value;
      queryRef.current.value = `${suggestArray[selectedSuggestion]} ${currentValue}`;
      console.log("Updated query -> ", queryRef.current.value);
      submitRef.current?.click();
    }
  }

  return (
    <>
      <div className="flex flex-row h-full">
        <div
          id="leftside"
          style={{ width: '85%', maxWidth: '85%', padding: '16px', borderRight: '1px solid #ccc' }}
        >
          <div className="rounded-2xl border h-full flex flex-col justify-between">
            <div className="p-6 overflow-auto" ref={containerRef}>
              {messages.map(({ id, role, content }: Message) => (
                <ChatLine
                  key={id}
                  id={id}
                  role={role}
                  content={content}
                  handleDelete={handleDelete}
                />
              ))}
            </div>

            <form id="chat" onSubmit={handleSubmit} className="p-4 flex clear-both">
              <Input
                ref={queryRef}
                value={input}
                placeholder={'Type to chat with AI...'}
                onChange={handleInputChange}
                className="mr-2"
              />

              {isLoading ? (
                <Button
                  onClick={() => {
                    stop();
                    setShowSuggestions(true);
                  }}
                  className="w-24"
                >
                  <Spinner /> Stop
                </Button>
              ) : (
                <Button className="w-24" onClick={handlePreSubmit}>Ask</Button>
              )}
              <Button ref={submitRef} type="submit" className="hidden"></Button>
            </form>
          </div>
        </div>
        <div id="rightside" style={{ width: '15%', maxWidth: '15%', padding: '16px' }}>
          {true &&
            suggestions.map((s: string, i: number) => (
              <PromptSuggestion key={s} handleClick={handleSuggestionClick} text={s} index={i} selected={selectedSuggestion} />
            ))}
        </div>
      </div>
    </>
  );
}
