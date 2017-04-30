/**
 * Firebase gets temperamental when trying to use it's promise-returning functions directly. This function takes the
 * Firebase Promise and wraps it in a standard Promise which libraries like redux-saga can work with. This also means
 * the promise execution works as Firebase expects. This can be used in `call` effects like:
 *
 * call(fbProxy, firebase.auth().signInWithPopup('google'))
 *
 * The proxying promise resolves and rejects as Firebase's does, thus the overall effect is identical.
 *
 * @param firebasePromise
 * @returns {Promise}
 */
export default function firebasePromiseProxy(firebasePromise) {
  return new Promise((resolve, reject) => {
    firebasePromise
      .then(r => resolve(r))
      .catch(e => reject(e));
  });
}
