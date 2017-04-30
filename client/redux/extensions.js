import { goBack } from 'react-router-redux';

export const routerPop = () => goBack(1);

export const RouterRedux = {
  pop: routerPop,
};
