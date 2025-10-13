import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import {
    Component,
    DestroyRef,
    inject,
    input,
    model,
    signal,
    WritableSignal,
    computed,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SvgIcon } from '@app/shared/components';
import { Dnd } from '@app/shared/directives';
import { ButtonModule } from 'primeng/button';
import { FormMessage } from '../form-message/form-message';
import { AdvertImage, UploadImage } from './domains';
import { SkeletonModule } from 'primeng/skeleton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ImageService } from '@app/shared/services';
import { catchError, of, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationService } from '@app/core/notification';

@Component({
    selector: 'app-images-upload',
    imports: [
        ButtonModule,
        SvgIcon,
        Dnd,
        FormsModule,
        DragDropModule,
        FormMessage,
        SkeletonModule,
        ProgressSpinnerModule,
    ],
    templateUrl: './images-upload.html',
    styleUrl: './images-upload.scss',
})
export class ImagesUpload {
    private readonly imageService = inject(ImageService);
    private readonly notify = inject(NotificationService);
    private readonly destroyRef = inject(DestroyRef);

    uploadImages = model<UploadImage[]>([]);
    advertImages = model<AdvertImage[]>([]);
    isDataLoading = input<boolean>(false);

    isImageLoaded = signal<boolean>(false);

    errorMessages = signal<WritableSignal<string | null>[]>([]);

    private readonly maxUploadImages = computed(() => {
        return 10 - this.advertImages().length;
    });

    // сортировка данных в uploadImages при перетаскивании превью изображений
    drop(event: CdkDragDrop<UploadImage[]>) {
        this.uploadImages.update((images) => {
            const copy = [...images];
            moveItemInArray(copy, event.previousIndex, event.currentIndex);
            return copy;
        });
    }

    removeImage(index: number) {
        this.uploadImages.update((images) => images.filter((_, i) => i !== index));
    }

    onFileInputChange(event: Event) {
        const input = event.target as HTMLInputElement;
        const files = Array.from(input.files ?? []);
        this.processImageFiles(files);
        input.value = '';
    }

    // загрузка файлов после перетаскивания в дроп-зону (от директивы dnd)
    onFilesDropped(files: File[]) {
        this.processImageFiles(files);
    }

    onImageLoad() {
        this.isImageLoaded.set(true);
    }

    // удаление изображения из объявления запросом на сервер
    deleteImageFromAdvert(id: string) {
        this.imageService
            .deleteImage(id)
            .pipe(
                tap(() => {
                    this.notify.success('Удаление изображения', 'Изображение успешно удалено');
                    this.advertImages.update((images) => images.filter((img) => img.id !== id));
                }),
                catchError((err) => {
                    console.error(err);
                    return of(null);
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }

    // валидация загруженных изображений
    private validateImageFiles(files: File[]): File[] {
        let validFiles: File[] = [];
        const newErrors: string[] = [];

        for (const file of files) {
            if (this.isDuplicateInUpload(file, validFiles)) {
                newErrors.push(`Файл "${file.name}" повторяется`);
                continue;
            }
            if (this.isDuplicateInExist(file)) {
                newErrors.push(`Файл "${file.name}" уже загружен`);
                continue;
            }
            if (!this.isValidFormat(file)) {
                newErrors.push(`Файл "${file.name}" в недопустимом формате`);
                continue;
            }
            if (!this.isValidSize(file)) {
                newErrors.push(`Файл "${file.name}" слишком большого размера (максимум 1 МБ)`);
                continue;
            }
            validFiles.push(file);
        }

        const { trimmedFiles, wasTrimmed } = this.trimFilesToMax(validFiles);
        if (wasTrimmed) {
            newErrors.push(`Превышен допустимый максимум изображений`);
        }

        if (newErrors.length > 0) {
            this.showErrorMessages(newErrors);
        }

        return trimmedFiles;
    }

    private processImageFiles(files: File[] | null | undefined) {
        if (!files || files.length === 0) return;

        const validFiles = this.validateImageFiles(files);
        if (validFiles.length === 0) return;

        validFiles.forEach((file) => {
            // создаем экземпляр FileReader
            const reader = new FileReader();
            // назначем обработчик onload
            reader.onload = (event) => {
                // сохраняем файл как base 64 строку
                const fileUrl = event.target?.result?.toString() ?? '';
                this.uploadImages.update((old) => [...old, this.createUploadImage(file, fileUrl)]);
            };
            // читаем файл полностью и кодируем его содержимое в base64 строку, обернутую в формат Data URL
            reader.readAsDataURL(file);
        });
    }

    private createUploadImage(file: File, fileUrl: string): UploadImage {
        return {
            id: crypto.randomUUID(),
            file,
            fileUrl,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
        };
    }

    // показываем все накопленные ошибки
    private showErrorMessages(messages: string[]) {
        const signals = messages.map((msg) => signal<string | null>(msg));
        this.errorMessages.update((errors) => [...errors, ...signals]);
    }

    // валидация дублей среди загружаемых изображений
    private isDuplicateInUpload(file: File, validFiles: File[]) {
        return validFiles.some((f) => f.name === file.name && f.size === file.size);
    }

    // валидация дублей среди уже загруженных
    private isDuplicateInExist(file: File) {
        return this.uploadImages().some(
            (img) => img.fileName === file.name && img.fileSize === file.size,
        );
    }

    // валидация формата файла
    private isValidFormat(file: File): boolean {
        const allowed = ['jpg', 'jpeg', 'png', 'heic'];
        const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
        return allowed.includes(ext);
    }

    // валидация размера файла
    private isValidSize(file: File): boolean {
        return file.size <= 1024 * 1024;
    }

    // валидация по максимальному числу уже загруженных изображений
    private trimFilesToMax(files: File[]): { trimmedFiles: File[]; wasTrimmed: boolean } {
        const totalFiles = this.uploadImages().length + files.length;
        const allowedCount = this.maxUploadImages() - this.uploadImages().length;

        if (totalFiles <= this.maxUploadImages()) {
            return { trimmedFiles: files, wasTrimmed: false };
        }

        return { trimmedFiles: files.slice(0, allowedCount), wasTrimmed: true };
    }
}
