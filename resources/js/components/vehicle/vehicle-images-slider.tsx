import ImagePreview from '@/components/imagePreview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { capitalizeWords } from '@/lib/utils';
import ImageSliderProvider from '../image-slider-provider';
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
                    <ImageSliderProvider>
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
                    </ImageSliderProvider>
                </div>
            </CardContent>
        </Card>
    );
}
