import ImagePreview from '@/components/imagePreview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { capitalizeWords } from '@/lib/utils';
import { RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { PhotoProvider } from 'react-photo-view';
export default function VehicleImagesSlider({
    image_urls,
}: {
    image_urls: Record<string, string>;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Vehicle Images</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                    <PhotoProvider
                        toolbarRender={({
                            onScale,
                            scale,
                            onRotate,
                            rotate,
                        }) => {
                            return (
                                <>
                                    <ZoomIn
                                        className="mx-2"
                                        onClick={() => onScale(scale + 1)}
                                    />
                                    <ZoomOut
                                        className="mx-2"
                                        onClick={() => onScale(scale - 1)}
                                    />
                                    <RotateCw
                                        className="mx-2"
                                        onClick={() => onRotate(rotate + 90)}
                                    />
                                </>
                            );
                        }}
                        speed={() => 800}
                        easing={(type) =>
                            type === 2
                                ? 'cubic-bezier(0.36, 0, 0.66, -0.56)'
                                : 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                        }
                    >
                        {image_urls &&
                            Object.entries(image_urls).map(
                                ([key, url], index) => (
                                    <div
                                        key={index}
                                        className="overflow-hidden rounded-xl border p-3"
                                    >
                                        <ImagePreview
                                            key={index}
                                            src={url as string}
                                        />

                                        <p className="mt-1 text-center text-sm capitalize">
                                            {capitalizeWords(key)}
                                        </p>
                                    </div>
                                ),
                            )}
                    </PhotoProvider>
                </div>
            </CardContent>
        </Card>
    );
}
