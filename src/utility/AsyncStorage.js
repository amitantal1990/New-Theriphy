import AsyncStorage from "@react-native-community/async-storage";


module.exports = {
    _storeData: async (key, data) => {
        try {
            await AsyncStorage.setItem(key,  JSON.stringify(data));
            return true
        } catch (error) {
            return false
        }
    },
    _retrieveData: async (key) => {
        try {
            let data = await AsyncStorage.getItem(key);
            if (data !== null) {
                return JSON.parse(data)
            } else {
                return data
            }
        } catch (error) {
               return false
        }
    },
    _deleteData: async (key) => {
        try {
            await AsyncStorage.removeItem(key);
            return true
        } catch (error) {
            return false
        }
    },
    flushAllKeys: () => {
        AsyncStorage.getAllKeys((err, keys) => {
            AsyncStorage.multiRemove(keys, (err) => {
                // keys removed, if they existed
                // do most stuff after removal (if you want)
              });
          });
    }
}

// export default localDatabase;