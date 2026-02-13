import { useState, useEffect } from 'react';
import { Play, X, ChevronLeft, ChevronRight, Trash2, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Media } from '../types/database';

interface MediaGalleryProps {
  refresh: number;
  onDeleteComplete: () => void;
}

export function MediaGallery({ refresh, onDeleteComplete }: MediaGalleryProps) {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadMedia();
  }, [refresh]);

  const loadMedia = async () => {
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMedia(data || []);
    } catch (err) {
      console.error('Error loading media:', err);
    } finally {
      setLoading(false);
    }
  };

  const getMediaUrl = (filePath: string) => {
    const { data } = supabase.storage.from('media').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleDelete = async (item: Media) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    setDeleting(true);
    try {
      const { error: storageError } = await supabase.storage
        .from('media')
        .remove([item.file_path]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('media')
        .delete()
        .eq('id', item.id);

      if (dbError) throw dbError;

      setSelectedIndex(null);
      onDeleteComplete();
    } catch (err) {
      console.error('Error deleting media:', err);
      alert('Failed to delete media');
    } finally {
      setDeleting(false);
    }
  };

  const handlePrevious = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null && selectedIndex < media.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'Escape') setSelectedIndex(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <Play className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No media yet</h3>
        <p className="text-gray-500">Upload your first photo or video to get started</p>
      </div>
    );
  }

  const selectedMedia = selectedIndex !== null ? media[selectedIndex] : null;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {media.map((item, index) => (
          <div
            key={item.id}
            onClick={() => setSelectedIndex(index)}
            className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
          >
            {item.file_type === 'video' ? (
              <div className="relative w-full h-full flex items-center justify-center bg-gray-900">
                <video
                  src={getMediaUrl(item.file_path)}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                  <Play className="w-12 h-12 text-white drop-shadow-lg" />
                </div>
              </div>
            ) : (
              <img
                src={getMediaUrl(item.file_path)}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white text-sm font-medium truncate">
                  {item.title}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedMedia && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={() => setSelectedIndex(null)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex(null);
            }}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
          >
            <X className="w-6 h-6 text-white" />
          </button>

        {selectedIndex !== null && selectedIndex > 0 && (
  <button
    onClick={(e) => {
      e.stopPropagation();
      handlePrevious();
    }}
    className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
  >
    <ChevronLeft className="w-6 h-6 text-white" />
  </button>
)}

{selectedIndex !== null && selectedIndex < media.length - 1 && (
  <button
    onClick={(e) => {
      e.stopPropagation();
      handleNext();
    }}
    className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
  >
    <ChevronRight className="w-6 h-6 text-white" />
  </button>
)}


          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(getMediaUrl(selectedMedia.file_path), '_blank');
              }}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">Download</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(selectedMedia);
              }}
              disabled={deleting}
              className="px-4 py-2 bg-red-500/80 hover:bg-red-500 rounded-full transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">
                {deleting ? 'Deleting...' : 'Delete'}
              </span>
            </button>
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-6xl max-h-[90vh] w-full mx-4"
          >
            {selectedMedia.file_type === 'video' ? (
              <video
                src={getMediaUrl(selectedMedia.file_path)}
                controls
                autoPlay
                className="w-full h-full max-h-[80vh] object-contain rounded-lg"
              />
            ) : (
              <img
                src={getMediaUrl(selectedMedia.file_path)}
                alt={selectedMedia.title}
                className="w-full h-full max-h-[80vh] object-contain rounded-lg"
              />
            )}
          </div>

          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
            <p className="text-white text-sm font-medium">{selectedMedia.title}</p>
          </div>
        </div>
      )}
    </>
  );
}
