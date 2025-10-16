export type ConfirmActionType =
    | 'settings'
    | 'password'
    | 'logout'
    | 'resetForm'
    | 'deleteAddress'
    | 'deleteAdvert';

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
    resetForm: {
        header: 'Очистка формы',
        message: 'Вы действительно хотите очистить все данные?',
    },
    deleteAddress: {
        header: 'Обновление данных',
        message: 'Вы действительно хотите удалить адрес?',
    },
    deleteAdvert: {
        header: 'Удаление объявления',
        message: 'Вы действительно хотите удалить объявление?',
    },
};
