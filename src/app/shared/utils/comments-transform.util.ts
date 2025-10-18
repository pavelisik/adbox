import { Comment, CommentFull } from '@app/pages/advert/domains';

/**
 * преобразует массив комментариев в дерево с вложенными child
 */
export function transformComments(comments: Comment[]): CommentFull[] {
    // сортировка по дате создания
    const sortedComments = [...comments].sort(
        (a, b) => new Date(a.created).getTime() - new Date(b.created).getTime(),
    );

    const commentsMap = new Map<string, CommentFull>();
    const rootsComments: CommentFull[] = [];

    // создаем копии комментариев с полем child
    for (const comment of sortedComments) {
        commentsMap.set(comment.id, { ...comment, child: [] });
    }

    // строим древовидную структуру
    for (const comment of sortedComments) {
        const currentComment = commentsMap.get(comment.id)!;
        if (comment.parentId) {
            const parentComment = commentsMap.get(comment.parentId);
            if (parentComment) parentComment.child.push(currentComment);
            else rootsComments.push(currentComment);
        } else {
            rootsComments.push(currentComment);
        }
    }

    return rootsComments;
}
