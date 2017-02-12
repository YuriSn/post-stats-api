/* eslint-disable */
const utils = {};

import moment from 'moment';

export const responseFormat = utils.formatMoney = ({ data: response }) => {
  const result = response.reduce((posts, post) => {
    if ('message' in post) {
      const likes = 'likes' in post ? post.likes.summary.total_count : 0;
      const comments = 'comments' in post ? post.comments.summary.total_count : 0;
      const shares = 'shares' in post ? post.shares.count : 0;
      const createdAt = moment(post.created_time).format('YYYY-MM-DD HH:mm:ss');
      const message = post.message.split(' ').slice(0, 10).join(' ');

      return [...posts, {
        message,
        created_time: createdAt,
        comments,
        shares,
        likes,
      }];
    }

    return posts;
  }, []);

  return result;
};

