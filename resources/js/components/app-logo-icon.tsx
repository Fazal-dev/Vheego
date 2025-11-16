import vheego from '@/asset/vheego.svg';
import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return <img width={50} height={50} src={vheego} />;
}
