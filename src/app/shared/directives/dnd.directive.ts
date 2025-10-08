import { Directive, EventEmitter, HostBinding, HostListener, output } from '@angular/core';

@Directive({
    selector: '[dnd]',
})
export class Dnd {
    fileDropped = output<File[]>();

    // декоратор HostBinding - привязывает свойство dragover к классу host-элемента
    @HostBinding('class.dragover')
    dragover = false;

    // декоратор HostListener - подписка на события DOM (декларативная замена EventListener)

    // подписывает метод onDragOver на событие dragover (когда файлы тащат над элементом)
    @HostListener('dragover', ['$event'])
    onDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.dragover = true;
    }

    // подписывает метод onDragLeave на событие dragleave (когда файлы уходят за пределы зоны)
    @HostListener('dragleave', ['$event'])
    onDragLeave(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.dragover = false;
    }

    // подписывает метод onDrop на событие drop (когда пользователь отпускает файлы над зоной)
    @HostListener('drop', ['$event'])
    onDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.dragover = false;

        const files = event.dataTransfer?.files;
        if (!files || files.length === 0) return;

        this.fileDropped.emit(Array.from(files));
    }
}
