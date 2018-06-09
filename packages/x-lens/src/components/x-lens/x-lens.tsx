import { Component, Prop, State } from '@stencil/core';
import { convertImageDataToCanvasURL } from 'lens-core';
import brightness from 'lens-filter-brightness';

@Component({
  tag: 'x-lens',
  styleUrl: 'x-lens.css',
  shadow: true
})
export class XLens {
  data: string;
  @State() isLoading: boolean = false;
  @Prop() src: string;
  @Prop() filter: string;
  @Prop() level: number;

  componentDidLoad() {
    this.isLoading = true;

    const img = new Image();
    img.crossOrigin = 'Anonymous';

    return new Promise(resolve => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);

        const data = context.getImageData(0, 0, img.width, img.height);

        return brightness({ data, options: { level: this.level }, nWorkers: 4 })
          .then(results => { this.data = convertImageDataToCanvasURL(results); })
          .then(() => {
            this.isLoading = false;
            return resolve(); 
          });
      };

      img.src = this.src;
    });
  }

  render() {
    return (
      <div>
        {this.isLoading && <span>Is Loading</span>}
        <img src={this.data} />
      </div>
    );
  }
}
