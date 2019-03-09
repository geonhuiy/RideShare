import { Pipe, PipeTransform } from '@angular/core';
import { DataProvider } from '../../providers/data/data';
import { User } from '../../interface/user';

/**
 * Generated class for the UsernamePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'username',
})
export class UsernamePipe implements PipeTransform {
  username = '';
  constructor(private dataProvider: DataProvider) {
  }
  transform(id: string, ...args) {
    return new Promise((resolve, reject) => {
      this.dataProvider.getUser(id).subscribe((response: User) => {
        resolve(response.username);
      });
    });
  }
}