import React, { useState } from "react";

type IconLoadingImageProps =
  React.ImgHTMLAttributes<HTMLImageElement> & {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  };

export default function IconLoadingImage({
  icon: Icon,
  ...props
}: IconLoadingImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full h-full">
      <img
        {...props}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover ${props.className ?? ""}`}
      />

      {!loaded && (
        <Icon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full text-primary/90 p-[25%]" />
      )}
    </div>
  );
}
