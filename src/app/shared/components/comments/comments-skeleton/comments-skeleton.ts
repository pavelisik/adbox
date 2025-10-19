import { Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'app-comments-skeleton',
    imports: [SkeletonModule],
    templateUrl: './comments-skeleton.html',
    styleUrl: './comments-skeleton.scss',
})
export class CommentsSkeleton {}
