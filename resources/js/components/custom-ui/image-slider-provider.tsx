import { RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { PhotoProvider } from 'react-photo-view';
export default function ImageSliderProvider({ children }: { children: any }) {
    return (
        <PhotoProvider
            toolbarRender={({ onScale, scale, onRotate, rotate }) => {
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
            {children}
        </PhotoProvider>
    );
}
