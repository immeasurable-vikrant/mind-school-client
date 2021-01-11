const rand = require('random-seed').create();
export const randomSort = () => {
  const type = ['title', 'category', 'average', 'reviews', 'enrolled', 'price'];
  const sort_type = type[rand(type.length)];
  const order = [1, -1];
  const sort_order = order[rand(order.length)];

  return {
    field: sort_type,
    value: sort_order,
  };
};
