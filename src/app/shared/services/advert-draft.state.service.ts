import { effect, Injectable, signal } from '@angular/core';
import { NewAdvertRequest } from '@app/pages/adverts-list/domains';
import { UploadImage } from '@app/shared/components/forms/images-upload/domains';
import { dataUrlToFile } from '@app/shared/utils';

const ADVERT_DRAFT_KEY = 'advertDraft';

interface AdvertDraft extends Partial<NewAdvertRequest> {
    uploadImages?: StoredUploadImage[];
}

type StoredUploadImage = Omit<UploadImage, 'file'>;

@Injectable({
    providedIn: 'root',
})
export class AdvertDraftStateService {
    private readonly _advertDraft = signal<AdvertDraft>({});
    readonly advertDraft = this._advertDraft.asReadonly();

    constructor() {
        this.loadFromStorage();
        effect(() => {
            // обновление черновика в localStorage
            localStorage.setItem(ADVERT_DRAFT_KEY, JSON.stringify(this._advertDraft()));
        });
    }

    // загрузка черновика в стейт из localStorage
    private loadFromStorage() {
        const savedDraft = localStorage.getItem(ADVERT_DRAFT_KEY);
        if (savedDraft) {
            try {
                this._advertDraft.set(JSON.parse(savedDraft));
            } catch {
                localStorage.removeItem(ADVERT_DRAFT_KEY);
            }
        }
    }

    // обновляем данные в стейте
    updateData(partialDraft: AdvertDraft) {
        this._advertDraft.update((currentDraft) => ({ ...currentDraft, ...partialDraft }));
    }

    // обновляем массив изображений в стейте (без поля file)
    updateImages(images: UploadImage[]) {
        const storedImages: StoredUploadImage[] = images.map((img) => ({
            id: img.id,
            fileUrl: img.fileUrl,
            fileName: img.fileName,
            fileType: img.fileType,
            fileSize: img.fileSize,
        }));

        this._advertDraft.update((currentDraft) => ({
            ...currentDraft,
            uploadImages: storedImages,
        }));
    }

    // восстанавливаем изображения в форме (добавляем поле file)
    restoreImages(): UploadImage[] {
        const storedImages = this._advertDraft()?.uploadImages;
        if (!storedImages) return [];

        return storedImages.map((img) => ({
            ...img,
            file: dataUrlToFile(img.fileUrl, img.fileName, img.fileType),
        }));
    }

    // удаление черновика из localStorage
    clear() {
        localStorage.removeItem(ADVERT_DRAFT_KEY);
        this._advertDraft.set({});
    }
}
