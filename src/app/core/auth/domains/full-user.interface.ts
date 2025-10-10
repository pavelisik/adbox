import { LocalUserData, User } from '@app/core/auth/domains';

export type FullUser = User & LocalUserData;
