import React, { useState } from 'react';
import { Camera, Upload, AlertCircle } from 'lucide-react';
import { generateRoast } from './services/geminiService';
import { AppState } from './types';
import { Loading } from './components/Loading';
import { RoastCard } from './components/RoastCard';
import { Button } from './components/Button';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    image: null,
    status: 'idle',
    roasts: null,
    errorMsg: null,
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleImageProcessing(file);
  };

  const handleImageProcessing = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setState(prev => ({ ...prev, errorMsg: "Please upload a valid image file." }));
      return;
    }

    // Read file
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setState({
        image: base64,
        status: 'analyzing',
        roasts: null,
        errorMsg: null,
      });

      try {
        const roasts = await generateRoast(base64);
        setState(prev => ({
          ...prev,
          status: 'result',
          roasts: roasts,
        }));
      } catch (error) {
        console.error(error);
        setState(prev => ({
          ...prev,
          status: 'error',
          errorMsg: "Failed to generate roast. The AI might be overwhelmed by your style.",
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const resetApp = () => {
    setState({
      image: null,
      status: 'idle',
      roasts: null,
      errorMsg: null,
    });
  };

  return (
    <div className="min-h-screen tiktok-gradient flex flex-col text-white overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>

      {/* Header */}
      <header className="p-6 text-center relative z-10">
        <h1 className="text-4xl font-black tracking-tighter italic drop-shadow-lg">
          Roast Cam 📸
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 w-full max-w-lg mx-auto relative z-10">
        
        {/* IDLE VIEW */}
        {state.status === 'idle' && (
          <div className="w-full space-y-8 animate-fade-in">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl text-center">
              <div className="mb-6">
                <img 
                  src="https://picsum.photos/400/400?grayscale" 
                  alt="Example" 
                  className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white/20 object-cover"
                />
                <p className="text-xl font-bold mb-2">Ready to get roasted?</p>
                <p className="text-white/70 text-sm">
                  Upload a photo or take a selfie. The AI will judge your choices in 3 unique styles.
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                  <Button fullWidth icon={<Upload size={20} />}>
                    Upload Photo
                  </Button>
                </div>
                
                <div className="relative">
                   <input
                    type="file"
                    accept="image/*"
                    capture="user"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                  <Button fullWidth variant="secondary" icon={<Camera size={20} />}>
                    Take Selfie
                  </Button>
                </div>
              </div>
            </div>
            
            <p className="text-center text-xs text-white/40 mt-8">
              By uploading, you agree to have your feelings hurt.
              <br/>Do not upload sensitive content.
            </p>
          </div>
        )}

        {/* LOADING VIEW */}
        {state.status === 'analyzing' && <Loading />}

        {/* RESULT VIEW */}
        {state.status === 'result' && state.image && state.roasts && (
          <RoastCard 
            imageSrc={state.image} 
            roasts={state.roasts} 
            onReset={resetApp} 
          />
        )}

        {/* ERROR VIEW */}
        {state.status === 'error' && (
          <div className="text-center p-8 bg-red-500/20 backdrop-blur-md rounded-3xl border border-red-500/30">
            <AlertCircle className="w-16 h-16 text-red-200 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Oof. Error.</h3>
            <p className="text-white/80 mb-6">{state.errorMsg}</p>
            <Button onClick={resetApp} variant="secondary">Try Again</Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;