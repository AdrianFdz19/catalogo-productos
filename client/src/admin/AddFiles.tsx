import React, { useRef, useState } from 'react';
import { X } from 'lucide-react';

interface AddFilesProps {
  onImagesChange: (files: File[]) => void;
}

const AddFiles: React.FC<AddFilesProps> = ({ onImagesChange }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [images, setImages] = useState<File[]>([]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    const updatedImages = [...images, ...newFiles];
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const removeImage = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
    onImagesChange(updated);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Imágenes del producto</label>

      <div
        className="w-full border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:border-blue-500 transition bg-gray-50"
        onClick={() => inputRef.current?.click()}
      >
        <p className="text-sm text-gray-600">Haz clic aquí para subir imágenes</p>
        <p className="text-xs text-gray-400">(Puedes subir varias)</p>
        <input
          type="file"
          accept="image/*"
          multiple
          ref={inputRef}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {images.map((file, index) => (
            <div
              key={index}
              className="relative w-full aspect-square rounded-md overflow-hidden shadow-sm group"
              draggable
              onDragStart={(e) => e.dataTransfer.setData('index', index.toString())}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const fromIndex = Number(e.dataTransfer.getData('index'));
                const toIndex = index;
                if (fromIndex === toIndex) return;

                const updated = [...images];
                const moved = updated.splice(fromIndex, 1)[0];
                updated.splice(toIndex, 0, moved);

                setImages(updated);
                onImagesChange(updated);
              }}
            >
              <img
                src={URL.createObjectURL(file)}
                alt={`preview-${index}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-white text-gray-800 rounded-full p-1 shadow group-hover:opacity-100 opacity-0 transition"
                title="Eliminar imagen"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddFiles;
