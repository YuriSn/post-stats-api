import moment from 'moment';

const utils = {};

export const convertToCSV = utils.convertToCSV = (args) => {
  let result;
  let ctr;

  const data = args.data || null;
  if (data == null || !data.length) {
    return null;
  }

  const columnDelimiter = args.columnDelimiter || ',';
  const lineDelimiter = args.lineDelimiter || '\n';

  const keys = Object.keys(data[0]);

  result = '';
  result += keys.join(columnDelimiter);
  result += lineDelimiter;

  data.forEach((item) => {
    ctr = 0;
    keys.forEach((key) => {
      if (ctr > 0) result += columnDelimiter;

      result += item[key];
      ctr += 1;
    });

    result += lineDelimiter;
  });

  return result;
};

export const responseFormat = utils.formatMoney = ({ data: response }) => {
  const result = response.reduce((posts, post) => {
    if ('message' in post) {
      const likes = 'likes' in post ? post.likes.data.length : 0;
      const comments = 'comments' in post ? post.comments.data.length : 0;
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
