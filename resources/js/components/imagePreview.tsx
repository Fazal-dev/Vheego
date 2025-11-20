import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export default function ImagePreview({ src }: { src: string }) {
    return (
        <Dialog>
            <DialogTrigger>
                <img
                    src={src}
                    className="h-full w-full cursor-pointer rounded-md object-contain"
                />
            </DialogTrigger>

            <DialogContent className="m-0 h-screen w-screen max-w-none p-0">
                <div className="flex h-full w-full items-center justify-center bg-black">
                    <img
                        src={src}
                        className="max-h-full max-w-full object-contain"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
