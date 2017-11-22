import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { persistStore, persistCombineReducers, createTransform, } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import moment from 'moment';
import traverse from 'traverse';

import reducers from '../reducers';

// const dateTransform = createTransform(null, (incomingState) => {
//     return traverse(incomingState).map((val) => {
//         if (val.datetime.isISOStringDate(val)) {
//             return new moment(val);
//         }
//
//         return val;
//     });
// });

// const dateTransform = createTransform(null, (incomingPooReducer) => {
//   return incomingPooReducer.myPoos.map(poo => {
//     const newDateTime = moment(poo.datetime);
//     const newPoo = poo;
//     newPoo.datetime = newDateTime;
//     return newPoo;
//   });
// });

const testTransform = createTransform(null, (incomingState) => {
  const newIncomingState = incomingState;
  const newPoos = incomingState.myPoos.map(poo => {
    const newDatetime = moment(poo.datetime);
    const newPoo = poo;
    newPoo.datetime = newDatetime;
    return newPoo;
  });
  newIncomingState.myPoos = newPoos;
  return newIncomingState;
});

const config = {
 key: 'root',
 storage: AsyncStorage,
 transforms: [testTransform],
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
