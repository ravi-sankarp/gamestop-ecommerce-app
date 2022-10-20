import Filter from 'bad-words';

// adding a new filter
const filter = new Filter();

const newBadWords = ['hell'];

// adding words to profanity filters
filter.addWords(...newBadWords);

export default filter;
