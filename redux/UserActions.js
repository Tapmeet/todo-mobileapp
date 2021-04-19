import { LOGGED_IN_USER } from './types';
// export const addUser = action => (
//   {
//     type: LOGGED_IN_USER,
//     payload: action,
//   }
// )

export function addUser(payload) {
  console.log(payload)
  return { type: 'LOGGED_IN_USER', payload };
}
