import { createStore, applyMiddleware } from 'redux'
import userDataReducer from './User'
import thunk from 'redux-thunk';
export default function configureStore() {
    return createStore(
        userDataReducer
    );
}