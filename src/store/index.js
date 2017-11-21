import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { persistStore, persistCombineReducers, createTransform, traverse } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import moment from 'moment';

import reducers from '../reducers';

// const dateTransform = createTransform(null, (outboundState) => {
//     return traverse(outboundState).map((val) => {
//         if (val.datetime.isISOStringDate(val)) {
//             return new moment(val);
//         }
//
//         return val;
//     });
// });

const config = {
 key: 'root',
 storage: AsyncStorage,
 // transforms: [dateTransform],
 whitelist: ['pooReducer']
};

const reducer = persistCombineReducers(config, reducers);

export default function configureStore() {
 const store = createStore(
     reducer
    //  initialState,
    //  applyMiddleware(thunk, logger)
 );

 const persistor = persistStore(store);
 return { persistor, store };
}

// const store = createStore(
//   reducers,
//   {},
//   compose(
//     applyMiddleware(thunk),
//     autoRehydrate()
//   )
// );
//
// persistStore(store, { storage: AsyncStorage, whiteList: ['pooReducer'] });

// export default store;
