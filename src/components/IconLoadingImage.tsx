import React, { useState } from "react";
import Image, {ImageProps} from "next/image";

export default function IconLoadingImage(props : ImageProps & { icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }) {
  const { icon: Icon, ...imageProps } = props;
  const [mounted, setMounted] = useState<boolean>(false)
  return (
    <>
      <Image
        {...imageProps}
        onLoadCapture={() => setMounted(true)}
      />
      
      {!mounted && <Icon className="absolute top-1/2 left-1/2 -translate-1/2 h-full w-full text-primary/90 p-[25%]" />}
    </>
  );
}
