import { UserType } from './User';

export interface EditProfileFormData {
  name: string;
  age?: number;
  location?: string;
  userType: UserType;
  languages: string[];
  profileImage?: string;
}

export const defaultEditProfileData: EditProfileFormData = {
  name: '',
  age: undefined,
  location: '',
  userType: 'Refugee',
  languages: [],
  profileImage: undefined
}; 