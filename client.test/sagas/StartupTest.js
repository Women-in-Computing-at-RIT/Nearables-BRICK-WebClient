import test from 'ava';
import {startup} from '../../client/sagas/Startup';
import StartupActions  from '../../client/redux/Startup';

const stepper = (fn) => (mock) => fn.next(mock).value;

test('Test that ava works', (t) => {
   
    const step = stepper(startup());
    t.pass('Hey! It Works!');
});