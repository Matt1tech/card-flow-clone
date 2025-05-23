
import React from 'react';
import { WorkspaceProvider } from '@/context/workspace';
import WorkspaceHeader from '@/components/WorkspaceHeader';
import BoardsList from '@/components/BoardsList';
import ThemeToggle from '@/components/ThemeToggle';

const Index = () => {
  return (
    <div className="flex flex-col h-screen bg-background">
      <WorkspaceProvider>
        <WorkspaceHeader />
        <main className="flex-1 bg-background overflow-auto">
          <BoardsList />
        </main>
      </WorkspaceProvider>
    </div>
  );
};

export default Index;
