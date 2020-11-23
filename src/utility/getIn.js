/**
 * @function getIn
 * @param {Object} obj
 * @param {Array} path
 *
 * @description this is an implementation of the getIn for the nested null checks which we  do for the API data.
 */
const getIn = (obj, path) => {
    if (!Array.isArray(path)) {
      throw new Error('A path array should be provided when calling getIn()');
    }
      if (obj == null) return undefined // eslint-disable-line
    let ptr = obj;
    for (let i = 0; i < path.length; i++) {
      const key = path[i];
        ptr = ptr != null ? ptr[key] : undefined // eslint-disable-line
      if (ptr === undefined) return ptr;
    }
    return ptr;
  };
  export default getIn;
  