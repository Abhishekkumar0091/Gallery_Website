import { useState } from 'react';
import { LogOut, Image, Upload as UploadIcon } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { AuthForm } from './components/AuthForm';
import { MediaUpload } from './components/MediaUpload';
import { MediaGallery } from './components/MediaGallery';

function App() {
  const { user, loading, signOut } = useAuth();
  const [refresh, setRefresh] = useState(0);
  const [showUpload, setShowUpload] = useState(false);

  const handleUploadComplete = () => {
    setRefresh((prev) => prev + 1);
    setShowUpload(false);
  };

  const handleDeleteComplete = () => {
    setRefresh((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

return (
  <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
    
    <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
              <Image className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Media Gallery</h1>
              <p className="text-xs text-gray-400">Your personal collection</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all shadow-md"
            >
              <UploadIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Upload</span>
            </button>

            <button
              onClick={signOut}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>

        </div>
      </div>
    </header>

    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {showUpload && (
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-gray-900 rounded-2xl shadow-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Upload Media</h2>
              <button
                onClick={() => setShowUpload(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="text-sm">Close</span>
              </button>
            </div>
            <MediaUpload onUploadComplete={handleUploadComplete} />
          </div>
        </div>
      )}

      <div className="bg-gray-900 rounded-2xl shadow-xl p-6 border border-gray-700">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Your Media</h2>
          <p className="text-gray-400">Click on any item to view it in full size</p>
        </div>
        <MediaGallery refresh={refresh} onDeleteComplete={handleDeleteComplete} />
      </div>

    </main>
  </div>
);

}

export default App;
