
import { BoardProvider } from '@/context/BoardContext';
import Board from '@/components/Board';

const Index = () => {
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Trello Clone</h1>
        </div>
      </header>
      
      <main className="flex-1 bg-background overflow-hidden flex flex-col">
        <BoardProvider>
          <Board />
        </BoardProvider>
      </main>
    </div>
  );
};

export default Index;
