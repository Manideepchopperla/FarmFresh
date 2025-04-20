import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage
import userReducer from './userSlice';
import cartReducer from './cartSlice';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);
const persistedCartReducer = persistReducer(persistConfig, cartReducer);


const appStore = configureStore({
  reducer: {
    user: persistedUserReducer,
    cart: persistedCartReducer,
  },
});

const persistor = persistStore(appStore);

export { appStore, persistor };