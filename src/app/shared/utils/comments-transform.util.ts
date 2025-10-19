import { Comment, CommentFull } from '@app/pages/advert/domains';

/**
 * преобразует массив комментариев в дерево с вложенными children
 */
export function transformComments(comments: Comment[]): CommentFull[] {
    // сортировка по дате создания
    const sortedComments = [...comments].sort(
        (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime(),
    );

    const commentsMap = new Map<string, CommentFull>();
    const rootsComments: CommentFull[] = [];

    // создаем копии комментариев с полем children
    for (const comment of sortedComments) {
        commentsMap.set(comment.id, { ...comment, children: [] });
    }

    // строим древовидную структуру
    for (const comment of sortedComments) {
        const currentComment = commentsMap.get(comment.id)!;
        if (comment.parentId) {
            const parentComment = commentsMap.get(comment.parentId);
            if (parentComment) parentComment.children.push(currentComment);
            else rootsComments.push(currentComment);
        } else {
            rootsComments.push(currentComment);
        }
    }

    return rootsComments;
}
