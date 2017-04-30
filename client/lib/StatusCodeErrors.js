import invariant from 'invariant';
import { makeArrayIterator, randomIndex, randomElement } from './utils';

/**
 * @template T
 * @param {[T]} array
 */
function * messageGenerator(array) {
  const iterator = makeArrayIterator(array, randomIndex(array));
  let random = false;
  
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (random) {
      random = yield randomElement(array);
    } else {
      random = yield iterator.next().value;
    }
  }
}


const StatusCodeMapping = {
  400: {
    name: 'Bad Request',
    messages: [
      'This is a *super* generic error, so you should report this.',
    ],
    locationMessage: (location) => location,
  },
  403: {
    name: 'Forbidden',
    messages: [
      'You shouldn\'t have come here...',
      'I\'ve been told that you aren\'t allowed to be here... so... leave.',
      'Why does this happen to me... I\'ve made my mistakes.',
      'If you think you *should* have access to this page then you probably do and should contact the administrator.',
      '403, it has more curves and is oh-so-slightly better than 404.',
      'ALERT, ALERT, ALERT: Seriously, I don\'t think you belong here.',
      'So long, and thanks for the all the fish.',
    ],
    locationMessage: (location) => `You currently cannot access ${location}.`,
  },
  404: {
    name: 'Not Found',
    messages: [
      'Well... this is just embarrassing.',
      'Now this is a story all about how my life got flipped-turned upside down, and I\'d like to take a minute; Just sit right there; ' +
      'I\'ll tell you how I became the 404 of the page called :location:. (Not really.)',
      'This doesn\'t happen very often, I swear!',
      'Oh man... I am just as disappointed as you are, trust me.',
    ],
    locationMessage: (location) => `${location} could not be found.`,
  },
  423: {
    name: 'Under Construction',
    messages: [
      'Woah! Must mean :location: is temporarily unavailable.',
      'This is a very incomplete alleyway. What an odd sentence.',
      'There *should* be something here. Hmm...',
      'WARNING: Developers being flogged ahead.',
      'It may be locked right now, but I promise you this: :location: is bigger on the inside.',
    ],
    locationMessage: (location) => `${location} is under construction/inaccessible.`,
  },
  0: {
    name: 'Error',
    messages: [
      'There was an issue loading or display this page. Please report this error.',
    ],
    locationMessage: (location) => location,
  },
};

const StatusCodeGenerators = {
};

Object.entries(StatusCodeMapping).forEach(([key, obj]) => StatusCodeGenerators[key] = messageGenerator(obj.messages));

invariant(StatusCodeMapping[0] != null, 'Default status code mapping does not exist.');

/**
 * @param {number} code
 * @param {boolean} randomizeArray Randomly pick from array of messages or not
 * @returns {{name: string, message: string, formatForLocation: function(string): string}}
 */
export default function statusMessage(code, randomizeArray = false) {
  /**
   * @type {{name: string, messages: [string]}}
   */
  let details = StatusCodeMapping[code];
  
  if (!details) {
    return statusMessage(0, randomizeArray);
  } else {
    const messageIterator = StatusCodeGenerators[code];
  
    return {
      name: details.name,
      message: messageIterator.next(randomizeArray).value,
      formatForLocation: details.locationMessage,
    };
  }
}
