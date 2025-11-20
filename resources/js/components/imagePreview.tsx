import { PhotoView } from 'react-photo-view';

export default function ImagePreview({ src }: { src: string }) {
    return (
        <div className="">
            <PhotoView src={src}>
                <div className="h-64 w-full overflow-hidden rounded border">
                    <img src={src} alt="" style={{ objectFit: 'contain' }} />
                </div>
            </PhotoView>
        </div>
    );
}
