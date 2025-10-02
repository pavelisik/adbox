export type ConfirmActionType = 'settings' | 'password' | 'logout';

export const CONFIRM_MESSAGES: Record<ConfirmActionType, { header: string; message: string }> = {
    settings: {
        header: 'Подтверждение',
        message: 'Вы уверены, что хотите изменить данные пользователя?',
    },
    password: {
        header: 'Подтверждение',
        message: 'Вы уверены, что хотите изменить пароль?',
    },
    logout: {
        header: 'Выход',
        message: 'Вы действительно хотите выйти из системы?',
    },
};
