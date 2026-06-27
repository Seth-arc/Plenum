import React from "react";
import { Composition } from "remotion";
import { BrandFilm } from "./BrandFilm";
import { VIDEO } from "../brand";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="PlenumBrandFilm"
      component={BrandFilm}
      durationInFrames={VIDEO.durationInFrames}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
  );
};
