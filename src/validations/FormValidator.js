export const isMobileNumber = number => {
  const pattern = /^\d{10}$/;
  return pattern.test(number);
};

export const isEmailAddress = email => {
  const pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return pattern.test(email);
};
