import {getUniqueId} from 'react-native-device-info';
// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

// User Preference
import {KEYS, storeData} from '../api/UserPreference';

const uploadToken = async (fcmToken) => {
  try {
    // fetching device's unique id
    let uniqueId = getUniqueId();

    if (uniqueId !== 'unknown') {
      // preparing params
      const params = {
        uniqueDeviceId: uniqueId,
        token: fcmToken,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'api/Customers/uploadToken',
        params,
      );

      if (response) {
        const {success} = response;
        if (success) {
          const {userInfo} = response;
          const {deviceId} = userInfo;
          // persisting deviceInfo
          await storeData(KEYS.DEVICE_UNIQUE_ID, {deviceId});
        }
      }
    }
  } catch (error) {
    console.log(error.message);
    return null;
  }
};

export default uploadToken;
