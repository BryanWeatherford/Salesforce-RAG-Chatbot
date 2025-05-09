import { ModeToggle } from '@/components/mode-toggle';
import { Chat } from '@/components/chat';

export default function Home() {
  return (
    <main className="relative container flex h-screen flex-col">
      <div className="p-4 flex h-14 items-center justify-between supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <span className="font-bold">RAG System for Salesforce</span>
        <ModeToggle />
      </div>
      <div className="flex py-4" style={{height: "calc(100% - 56px)"}}>
        <div className="w-full h-full">
          <Chat />
        </div>
      </div>
    </main>
  );
}
