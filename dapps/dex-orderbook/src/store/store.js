import { configureStore, combineReducers } from '@reduxjs/toolkit'

// Import Reducers
import {provider,tokens} from './reducers'

const initialState = {}

const reducer = combineReducers({
    provider,
    tokens
})

const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
    initialState
})

export default store


