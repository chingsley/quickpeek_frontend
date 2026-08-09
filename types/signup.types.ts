import React from 'react';

export interface SignupFormData {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserDetailsFormProps {
  formData: SignupFormData;
  setFormData: React.Dispatch<React.SetStateAction<SignupFormData>>;
  onSubmit: () => void;
  isLoading?: boolean;
}
