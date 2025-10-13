export type AdvertImage = Pick<UploadImage, 'id' | 'fileUrl'>;

export interface UploadImage {
    id: string;
    file: File;
    fileUrl: string;
    fileName: string;
    fileType: string;
    fileSize: number;
}
