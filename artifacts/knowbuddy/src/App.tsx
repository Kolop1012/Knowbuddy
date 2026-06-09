import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import type { PerspectiveData } from "@/mock-data";
import type { SearchSource } from "@/types";

// Import Screens
import { SplashScreen } from "@/pages/SplashScreen";
import { InputScreen } from "@/pages/InputScreen";
import { PerspectiveScreen } from "@/pages/PerspectiveScreen";
import { InfoPage } from "@/pages/InfoPage";

const queryClient = new QueryClient();

type ScreenState = 'splash' | 'input' | 'perspective' | 'info';

function KnowbuddyApp() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('splash');
  const [topic, setTopic] = useState('');
  const [perspectives, setPerspectives] = useState<PerspectiveData[]>([]);
  const [source, setSource] = useState<SearchSource | null>(null);
  const [selectedPerspectiveIndex, setSelectedPerspectiveIndex] = useState(0);

  const handleSearch = (
    newTopic: string,
    newPerspectives: PerspectiveData[],
    newSource: SearchSource,
  ) => {
    setTopic(newTopic);
    setPerspectives(newPerspectives);
    setSource(newSource);
    setCurrentScreen('perspective');
  };

  const handleOpenInfo = (index: number) => {
    setSelectedPerspectiveIndex(index);
    setCurrentScreen('info');
  };

  return (
    <div
      className="w-full h-[100dvh] overflow-hidden relative flex justify-center"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 50% 30%, #142647 0%, #0a1424 60%, #060d1a 100%)',
      }}
    >
      <div className="relative w-full max-w-[480px] h-full overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.5)] ring-1 ring-white/5">
      <AnimatePresence mode="wait">
        {currentScreen === 'splash' && (
          <SplashScreen 
            key="splash" 
            onComplete={() => setCurrentScreen('input')} 
          />
        )}
        
        {currentScreen === 'input' && (
          <InputScreen 
            key="input" 
            onSearch={handleSearch} 
          />
        )}
        
        {currentScreen === 'perspective' && (
          <PerspectiveScreen 
            key="perspective" 
            topic={topic} 
            perspectives={perspectives}
            source={source}
            onBack={() => setCurrentScreen('input')}
            onOpenInfo={handleOpenInfo}
          />
        )}

        {currentScreen === 'info' && (
          <InfoPage 
            key="info" 
            topic={topic}
            perspectives={perspectives}
            perspectiveIndex={selectedPerspectiveIndex}
            onBack={() => setCurrentScreen('perspective')}
          />
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <KnowbuddyApp />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
