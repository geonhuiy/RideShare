import { NgModule } from '@angular/core';
import { ThumbnailPipe } from './thumbnail/thumbnail';
import { UsernamePipe } from './username/username';
@NgModule({
	declarations: [ThumbnailPipe,
    UsernamePipe],
	imports: [],
	exports: [ThumbnailPipe,
    UsernamePipe]
})
export class PipesModule {}
