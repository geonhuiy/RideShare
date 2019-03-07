import { Pipe, PipeTransform } from '@angular/core';
import { DataProvider } from '../../providers/data/data';
import { Pic } from '../../interface/media';

/**
 * Generated class for the ThumbnailPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'thumbnail',
})
export class ThumbnailPipe implements PipeTransform {
  thumbnail = '';
  constructor(private dataProvider: DataProvider) {
  }
  transform(id: number, ...args) {
    return new Promise((resolve, reject) => {
      this.dataProvider.getSingleMedia(id).subscribe((response: Pic) => {
        switch (args[0]) {
          case 'large':
            resolve(response.thumbnails.w640);
            break;
          case 'medium':
            resolve(response.thumbnails.w320);
            break;
          case 'screenshot':
            resolve(response.screenshot);
            break;
          default:
            resolve(response.thumbnails.w160);
        }
      });
    });
  }
}