import { Button } from '@/components/ui/button';
import React, { useRef, useState } from 'react';
import { Cropper, CropperRef } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';
import { useDropzone } from 'react-dropzone';

interface ImageCropperProps {
    label: string; // Image label: "Front Image"
    imageKey: string; // Key: "front_image"
    aspectRatio: number; // optional, default 1
    onCropChange: (key: string, cropped: string) => void; // save cropped base64
    value?: string; // initial value
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
    label,
    imageKey,
    aspectRatio = 1,
    onCropChange,
    value,
}) => {
    const cropperRef = useRef<CropperRef>(null);
    const [image, setImage] = useState<string | null>(value || null);
    const [preview, setPreview] = useState<string | null>(value || null);
    const [mode, setMode] = useState<'drop' | 'crop' | 'final'>('drop');
    const ratio: number = aspectRatio ?? 1; // fallback to 1 if undefined
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { 'image/*': [] },
        multiple: false,
        onDrop: (files) => {
            const file = files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result as string);
                setMode('crop');
            };
            reader.readAsDataURL(file);
        },
    });

    const handleCrop = () => {
        const canvas = cropperRef.current?.getCanvas();
        if (!canvas) return;

        const cropped = canvas.toDataURL('image/png');
        setPreview(cropped);
        onCropChange(imageKey, cropped);
        setMode('final');
    };

    const handleCancel = () => {
        setImage(null);
        setPreview(null);
        setMode('drop');
    };

    const handleChange = () => {
        setMode('drop');
        setImage(null);
        setPreview(null);
    };

    return (
        <div className="flex flex-col gap-2 rounded-md border p-2">
            <span className="font-semibold">{label}</span>

            {/* Drop area */}
            {mode === 'drop' && (
                <div
                    {...getRootProps()}
                    className={`flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed ${
                        isDragActive
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300'
                    }`}
                >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <p>Drop image here...</p>
                    ) : (
                        <p>Drag & Drop or Click</p>
                    )}
                </div>
            )}

            {/* Cropper */}
            {mode === 'crop' && image && (
                <div className="flex flex-col items-center gap-2">
                    <div className="h-64 w-full overflow-hidden rounded border">
                        <Cropper
                            ref={cropperRef}
                            src={image}
                            aspectRatio={aspectRatio ?? 1}
                            className="h-full w-full"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handleCancel} variant="outline">
                            Cancel
                        </Button>
                        <Button onClick={handleCrop}>Confirm Crop</Button>
                    </div>
                </div>
            )}

            {/* Final preview */}
            {mode === 'final' && preview && (
                <div className="flex flex-col items-center gap-2">
                    <img src={preview} className="max-h-40 rounded-md" />
                    <Button onClick={handleChange} variant="outline" size="sm">
                        Change Image
                    </Button>
                </div>
            )}
        </div>
    );
};
