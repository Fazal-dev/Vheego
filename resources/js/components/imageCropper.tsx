import { Button } from '@/components/ui/button';
import { CloudUpload } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { Cropper, CropperRef } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';
import { useDropzone } from 'react-dropzone';

interface ImageCropperProps {
    label: string;
    imageKey: string;
    aspectRatio?: number | undefined;
    onCropChange: (key: string, cropped: string) => void;
    value?: string;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
    label,
    imageKey,
    aspectRatio = 1,
    onCropChange,
    value,
}) => {
    const cropperRef = useRef<CropperRef>(null);
    const [image, setImage] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [mode, setMode] = useState<'drop' | 'crop' | 'final'>('drop');

    // Initialize preview if value exists (edit mode)
    React.useEffect(() => {
        if (value) {
            setPreview(value);
            setMode('final'); // directly show final preview
        }
    }, [value]);

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

        canvas.toBlob((blob) => {
            if (blob) {
                // Create object URL for preview
                // const previewUrl = URL.createObjectURL(blob);
                // setPreview(previewUrl);
                onCropChange(imageKey, blob as unknown as string);

                setMode('final');
            }
        }, 'image/png');

        setPreview(cropped);
        setMode('final');
    };

    const handleCancel = () => {
        setImage(null);
        setMode(preview ? 'final' : 'drop');
    };

    const handleChange = () => {
        setImage(null);
        setPreview(null);
        setMode('drop');
    };
    const aspectRatioProp =
        aspectRatio != null
            ? { minimum: aspectRatio, maximum: aspectRatio }
            : undefined;

    return (
        <div className="flex flex-col gap-2 rounded-md border border-black p-2 text-center">
            <span className="font-semibold">{label}</span>

            {/* Drop area */}
            {mode === 'drop' && (
                <div
                    {...getRootProps()}
                    className={`flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors duration-300 ${isDragActive ? 'border-blue-600 bg-blue-100' : 'border-gray-300 bg-white hover:border-blue-400'} `}
                    aria-label="File Upload Dropzone"
                    role="button"
                    tabIndex={0}
                >
                    <input {...getInputProps()} />
                    <CloudUpload
                        className={`mb-2 h-10 w-10 ${isDragActive ? 'text-blue-600' : 'text-gray-400'}`}
                    />
                    <p
                        className={`text-center font-medium ${isDragActive ? 'text-blue-600' : 'text-gray-600'}`}
                    >
                        {isDragActive
                            ? 'Drop image here...'
                            : 'Drag & Drop or Click to Upload'}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                        Supported formats: JPG, PNG, GIF
                    </p>
                </div>
            )}

            {/* Cropper */}
            {mode === 'crop' && image && (
                <div className="flex flex-col items-center gap-2">
                    <div className="h-64 w-full overflow-hidden rounded border">
                        <Cropper
                            ref={cropperRef}
                            src={image}
                            stencilProps={{ aspectRatio: aspectRatioProp }}
                            className="h-full w-full"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            onClick={handleCancel}
                            variant="destructive"
                        >
                            Cancel
                        </Button>
                        <Button size="sm" onClick={handleCrop}>
                            Confirm Crop
                        </Button>
                    </div>
                </div>
            )}

            {/* Final preview */}
            {mode === 'final' && preview && (
                <div className="flex flex-col items-center gap-2">
                    <div className="h-64 w-full overflow-hidden rounded border">
                        <img
                            src={preview}
                            className="h-64 w-full rounded-md object-contain"
                        />
                    </div>
                    <Button onClick={handleChange} variant="outline" size="sm">
                        Change Image
                    </Button>
                </div>
            )}
        </div>
    );
};
