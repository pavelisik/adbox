import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SvgIcon } from '@app/shared/components';
import { Dnd } from '@app/shared/directives';
import { ButtonModule } from 'primeng/button';
import { FormMessage } from '../form-message/form-message';
import { UploadImage } from './domains';

@Component({
    selector: 'app-images-upload',
    imports: [ButtonModule, SvgIcon, Dnd, FormsModule, DragDropModule, FormMessage],
    templateUrl: './images-upload.html',
    styleUrl: './images-upload.scss',
})
export class ImagesUpload {
    uploadImages = model<UploadImage[]>([]);
    errorMessages = signal<string[] | null>(null);

    private readonly MAX_UPLOAD_IMAGES = 10;
    private readonly MAX_FILE_SIZE = 1024 * 1024;

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
                newErrors.push(
                    `Файл "${file.name}" в недопустимом формате (только jpg, png, heic)`,
                );
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
            newErrors.push(`Превышен допустимый максимум (${this.MAX_UPLOAD_IMAGES} изображений)`);
        }

        this.errorMessages.set(newErrors.length ? newErrors : null);
        setTimeout(() => {
            this.errorMessages.set(null);
        }, 3400);

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
        return file.size <= this.MAX_FILE_SIZE;
    }

    // валидация по максимальному числу уже загруженных изображений
    private trimFilesToMax(files: File[]): { trimmedFiles: File[]; wasTrimmed: boolean } {
        const totalFiles = this.uploadImages().length + files.length;
        const allowedCount = this.MAX_UPLOAD_IMAGES - this.uploadImages().length;

        if (totalFiles <= this.MAX_UPLOAD_IMAGES) {
            return { trimmedFiles: files, wasTrimmed: false };
        }

        return { trimmedFiles: files.slice(0, allowedCount), wasTrimmed: true };
    }
}
