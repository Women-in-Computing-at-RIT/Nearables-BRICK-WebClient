import is from 'is_js';
import R from 'ramda';
import Immutable from 'seamless-immutable';

const isImmutable = (x) => is.function(x.asMutable);
const convertToJs = (state) => state.asMutable({deep: true});

const fromImmutable = R.when(isImmutable, convertToJs);
const toImmutable = (raw) => Immutable(raw);


// Redux Persist Transformer Interface
export default {
  out: (state) => {
        // Prevents redux-persist from reducing state to a Plain Object
    state.mergeDeep = R.identity;
    return toImmutable(state);
  },
  in: (raw) => {
    return fromImmutable(raw);
  },
};