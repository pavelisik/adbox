/**
 * преобразует строку Data URL в объект File
 */
export function dataUrlToFile(dataUrl: string, fileName: string, fileType: string): File {
    // разделяем строку Data URL на метаданные и собственно base64
    const [metaData, base64Data] = dataUrl.split(',');
    // декодируем base64 в бинарную строку
    const binaryString = atob(base64Data);
    // создаем массив байтов для хранения бинарных данных
    const byteArray = new Uint8Array(binaryString.length);
    // заполняем массив байтов кодами символов из бинарной строки
    for (let i = 0; i < binaryString.length; i++) {
        byteArray[i] = binaryString.charCodeAt(i);
    }
    // создаем объект File из массива байтов
    return new File([byteArray], fileName, { type: fileType });
}
