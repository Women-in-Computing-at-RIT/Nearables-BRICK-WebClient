import R, {unless, isNil, ifElse, gte, length, pipe, lte, test, both} from 'ramda';

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

const Nothing = () => undefined;
const Message = (msg) => R.always(msg);

export const required =
  ifElse(
    isNil,
    Message('Required'),
    Nothing
  );

export const maxLength = (max) =>
  unless(
    isNil,
    ifElse(
      pipe(length, lte(max)),
      Message(`Must be less than ${max} characters long`),
      Nothing
    )
  );

export const minLength = (min) =>
  unless(
    isNil,
    ifElse(
      pipe(length, gte(min)),
      Message(`Must be more than ${min} characters long`),
      Nothing
    )
  );

export const boundLength = (min, max) =>
  ifElse(
    both(minLength(min), maxLength(max)),
    Message(`Must be between ${min} and ${max} characters long`),
    Nothing
  );

export const email =
  unless(
    isNil,
    ifElse(
      test(emailRegex),
      Message('Invalid email address'),
      Nothing
    )
  );

export default {
  required,
  minLength,
  maxLength,
  boundLength,
  email,
};
