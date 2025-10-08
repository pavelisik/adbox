import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, computed, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SvgIcon } from '@app/shared/components';
import { Dnd } from '@app/shared/directives';
import { ButtonModule } from 'primeng/button';
import { FormMessage } from '../form-message/form-message';

@Component({
    selector: 'app-images-upload',
    imports: [ButtonModule, SvgIcon, Dnd, FormsModule, DragDropModule, FormMessage],
    templateUrl: './images-upload.html',
    styleUrl: './images-upload.scss',
})
export class ImagesUpload {
    imagesFiles = signal<File[]>([]);
    imagesPreviews = signal<string[]>([]);
    errorMessages = signal<string[]>([]);

    drop(event: CdkDragDrop<string[]>) {
        this.imagesPreviews.update((previews) => {
            const copy = [...previews];
            moveItemInArray(copy, event.previousIndex, event.currentIndex);
            return copy;
        });

        this.imagesFiles.update((files) => {
            const copy = [...files];
            moveItemInArray(copy, event.previousIndex, event.currentIndex);
            return copy;
        });
    }

    removeImage(index: number) {
        this.imagesFiles.update((files) => files.filter((_, i) => i !== index));
        this.imagesPreviews.update((previews) => previews.filter((_, i) => i !== index));
    }

    openFileDialog(fileInput: HTMLInputElement, event?: MouseEvent) {
        fileInput.click();
        event?.stopPropagation();
    }

    onFileInputChange(event: Event) {
        const input = event.target as HTMLInputElement;
        const files = Array.from((event.target as HTMLInputElement).files ?? []);
        this.processImageFiles(files);
        input.value = '';
    }

    onFilesDropped(files: File[]) {
        this.errorMessages.set([]);
        this.processImageFiles(files);
    }

    private processImageFiles(files: File[] | null | undefined) {
        this.errorMessages.set([]);
        if (!files || files.length === 0) return;

        const newErrors: string[] = [];

        // проверяем ограничения на максимальное количество файлов
        const totalFiles = this.imagesFiles().length + files.length;
        if (totalFiles > 10) {
            newErrors.push('Максимум 10 изображений');
            files = files.slice(0, 10 - this.imagesFiles().length);
        }

        const validFiles: File[] = [];

        files.forEach((file) => {
            if (!this.isValidFormat(file)) {
                newErrors.push(`${file.name} — недопустимый формат (только jpg, png, heic)`);
                return;
            }

            if (!this.isValidSize(file)) {
                newErrors.push(`${file.name} — слишком большой файл (максимум 1 МБ)`);
                return;
            }

            validFiles.push(file);
        });

        if (newErrors.length > 0) {
            this.errorMessages.set(newErrors);
        }

        // затем уже можно проверять, есть ли валидные файлы
        if (validFiles.length === 0) {
            return; // дальше нечего обрабатывать
        }

        // читаем файлы и проверяем на дубликаты
        const previews: string[] = [];
        let processedCount = 0;

        validFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = event.target?.result?.toString() ?? '';

                if (this.isDuplicate(file, base64)) {
                    newErrors.push(`${file.name} — дубликат`);
                } else {
                    this.imagesFiles.update((old) => [...old, file]);
                    this.imagesPreviews.update((old) => [...old, base64]);
                }

                processedCount++;
                if (processedCount === validFiles.length) {
                    this.errorMessages.set(newErrors);
                }
            };
            reader.readAsDataURL(file);
        });
    }

    // Валидация формата файла
    private isValidFormat(file: File): boolean {
        const allowed = ['jpg', 'jpeg', 'png', 'heic'];
        const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
        return allowed.includes(ext);
    }

    // Валидация размера файла (1 МБ максимум)
    private isValidSize(file: File): boolean {
        return file.size <= 1024 * 1024; // 1 МБ
    }

    // Проверка на дубликаты по base64 и размеру файла
    private isDuplicate(file: File, base64: string): boolean {
        const existingFiles = this.imagesFiles();
        const existingPreviews = this.imagesPreviews();

        return existingFiles.some((f, i) => f.size === file.size && existingPreviews[i] === base64);
    }

    constructor() {
        effect(() => {
            console.log(this.imagesPreviews());
        });
    }
}
