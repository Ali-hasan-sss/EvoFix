declare module "react-slick" {
  import * as React from "react";

  export interface Settings {
    dots?: boolean;
    infinite?: boolean;
    speed?: number;
    slidesToShow?: number;
    slidesToScroll?: number;
    autoplay?: boolean;
    autoplaySpeed?: number;
    swipeToSlide?: boolean;
  }

  export class Slider extends React.Component<Settings> {}

  export default Slider;
}
