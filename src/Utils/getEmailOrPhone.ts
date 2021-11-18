export const getPhoneOrEmail = (
  emailOrPhoneField: string | number,
): {
  type: 'email' | 'phone';
  value: string;
} => {
  if (typeof emailOrPhoneField === 'number') {
    return {
      type: 'phone',
      value: emailOrPhoneField.toString(),
    };
  }
  return {
    type: 'email',
    value: emailOrPhoneField,
  };
};
