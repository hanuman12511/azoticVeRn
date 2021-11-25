import RNCryptor from 'react-native-rncryptor';

// Secret Key
const SECRET_KEY = 'com.doomshell.idsprime';

export const encryptData = async (plainData) => {
  try {
    const cipherData = await RNCryptor.encrypt(plainData, SECRET_KEY);
    return cipherData;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};

export const decryptData = async (cipherData) => {
  try {
    const plainData = await RNCryptor.decrypt(cipherData, SECRET_KEY);
    return plainData;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};
