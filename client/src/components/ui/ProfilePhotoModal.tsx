import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { SheetModal } from './SheetModal';
import { Button } from './Button';
import { useToast } from './ToastContext';
import { Camera, Trash, MagnifyingGlassPlus, Check } from '@phosphor-icons/react';

interface ProfilePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfilePhotoModal: React.FC<ProfilePhotoModalProps> = ({ isOpen, onClose }) => {
  const { user, profile, refreshUser } = useAuth();
  const toast = useToast();

  const [rawImage, setRawImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isSaving, setIsSaving] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentPhoto = user?.avatarUrl || profile?.avatarUrl || profile?.photoUrl;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type: JPG, PNG, WebP
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setFileError('Please select a JPG, PNG, or WebP photo.');
      return;
    }

    // Validate size: max 5 MB
    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      setFileError('The image is larger than 5 MB. Please choose a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setRawImage(event.target?.result as string);
      setZoom(1);
      setOffsetX(0);
      setOffsetY(0);
    };
    reader.readAsDataURL(file);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!rawImage) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - offsetX, y: e.clientY - offsetY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffsetX(e.clientX - dragStart.x);
    setOffsetY(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    setFileError(null);

    try {
      let finalDataUrl: string | undefined = undefined;

      if (rawImage) {
        // Render square 400x400 crop onto off-screen canvas
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          const img = new Image();
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = reject;
            img.src = rawImage;
          });

          // Draw image centered with zoom and offset
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, 400, 400);

          const scale = zoom;
          const drawW = img.width * scale;
          const drawH = img.height * scale;
          const drawX = (400 - drawW) / 2 + offsetX;
          const drawY = (400 - drawH) / 2 + offsetY;

          ctx.drawImage(img, drawX, drawY, drawW, drawH);
          finalDataUrl = canvas.toDataURL('image/jpeg', 0.88);
        }
      }

      await api.updateProfilePhoto(user.id, finalDataUrl);
      await refreshUser();
      toast.success('Profile photo updated successfully.');
      onClose();
    } catch (err: any) {
      setFileError(err.message || 'Failed to save photo.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!user) return;
    if (!window.confirm('Remove your profile photo?')) return;
    setIsSaving(true);
    try {
      await api.updateProfilePhoto(user.id, undefined);
      await refreshUser();
      setRawImage(null);
      toast.info('Profile photo removed.');
      onClose();
    } catch (err: any) {
      setFileError(err.message || 'Failed to remove photo.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SheetModal
      isOpen={isOpen}
      onClose={onClose}
      title="Update profile photo"
      subtitle="Upload and crop a clear square photo for your ID pass and rosters"
      maxWidth="md"
    >
      <div className="space-y-5">
        {fileError && (
          <div className="p-3 bg-red-50 text-role-teamlead text-sm font-semibold rounded-[8px]">
            {fileError}
          </div>
        )}

        {/* Viewfinder Canvas / Area */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div
            className="relative w-64 h-64 rounded-[12px] bg-[#F1F3F6] overflow-hidden cursor-move flex items-center justify-center select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {rawImage ? (
              <img
                src={rawImage}
                alt="Upload preview"
                className="absolute pointer-events-none select-none max-w-none transition-transform duration-75"
                style={{
                  transform: `translate(${offsetX}px, ${offsetY}px) scale(${zoom})`,
                  maxWidth: '100%',
                  maxHeight: '100%',
                  top: '0',
                  left: '0',
                  right: '0',
                  bottom: '0',
                  margin: 'auto',
                }}
              />
            ) : currentPhoto ? (
              <img
                src={currentPhoto}
                alt="Current profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-canvas-inset text-ink-secondary">
                <Camera className="w-12 h-12 mb-2" weight="bold" />
                <span className="text-sm font-bold tracking-tight">No photo chosen</span>
              </div>
            )}

            {/* Viewfinder crosshairs */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-full h-[1px] bg-white/20" />
              <div className="h-full w-[1px] bg-white/20 absolute" />
            </div>
          </div>

          <p className="text-[13px] text-ink-secondary">
            {rawImage ? 'Drag to position photo. Use zoom slider to fit.' : 'Square crop (400 × 400 px) for ID cards and rosters.'}
          </p>
        </div>

        {/* Zoom Slider Control (only when new image is loaded) */}
        {rawImage && (
          <div className="space-y-2 bg-[#F1F3F6] p-4 rounded-[12px]">
            <div className="flex items-center justify-between text-sm font-bold text-ink-primary">
              <span className="flex items-center gap-1.5">
                <MagnifyingGlassPlus className="w-4 h-4" weight="bold" />
                Zoom and scale
              </span>
              <span>{Math.round(zoom * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full accent-ink-primary cursor-pointer"
            />
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              leftIcon={<Camera className="w-4 h-4" weight="bold" />}
            >
              {currentPhoto || rawImage ? 'Choose different file' : 'Choose file'}
            </Button>

            {currentPhoto && !rawImage && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemovePhoto}
                leftIcon={<Trash className="w-4 h-4 text-role-teamlead" weight="bold" />}
                className="text-role-teamlead hover:bg-red-50"
              >
                Remove
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              isLoading={isSaving}
              disabled={!rawImage && !currentPhoto}
              onClick={handleSave}
              leftIcon={<Check className="w-4 h-4" weight="bold" />}
            >
              Save picture
            </Button>
          </div>
        </div>
      </div>
    </SheetModal>
  );
};
