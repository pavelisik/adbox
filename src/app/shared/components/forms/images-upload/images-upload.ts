import { Component, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SvgIcon } from '@app/shared/components';
import { Dnd } from '@app/shared/directives';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
    selector: 'app-images-upload',
    imports: [ButtonModule, SvgIcon, Dnd, FormsModule, FileUploadModule],
    templateUrl: './images-upload.html',
    styleUrl: './images-upload.scss',
})
export class ImagesUpload {
    imagesFiles = signal<File[]>([]);
    imagesPreviews = signal<string[]>([]);

    openFileDialog(fileInput: HTMLInputElement, event?: MouseEvent) {
        fileInput.click();
        event?.stopPropagation();
    }

    onFileInputChange(event: Event) {
        const files = Array.from((event.target as HTMLInputElement).files ?? []);
        this.processImageFiles(files);
    }

    onFilesDropped(files: File[]) {
        this.processImageFiles(files);
    }

    processImageFiles(files: File[] | null | undefined) {
        if (!files || files.length === 0) return;

        const imageFiles = files.filter((file) => file.type.match('image'));
        if (imageFiles.length === 0) return;

        const previews: string[] = [];

        imageFiles.forEach((file) => {
            // для каждого файла создаем FileReader
            const reader = new FileReader();

            // назначем обработчик onload, загружаем файл с изображением как base64 строку
            reader.onload = (event) => {
                const result = event.target?.result?.toString() ?? '';
                previews.push(result);

                if (previews.length === imageFiles.length) {
                    this.imagesFiles.set(imageFiles);
                    this.imagesPreviews.set(previews);
                }
            };

            // читает файл полностью и кодирует его содержимое в base64 строку, обернутую в формат Data URL
            reader.readAsDataURL(file);
        });
    }
}
