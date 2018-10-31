import axios from 'axios'; // imports axios library
import qs from 'query-string'; // imports qs library

export function getArticleById(shortId) {
  return axios.get(
    `/api/articles/findOne?${qs.stringify({
      filter: JSON.stringify({ where: { shortId } })
    })}`
  );
}

export function getFeaturedList(skip = 0) {
  return axios.get(
    `/api/articles?${qs.stringify({
      filter: JSON.stringify({
        where: { featured: true, published: true },
        order: 'firstPublishedDate DESC',
        limit: 10,
        skip
      })
    })}`
  );
}

export function postPopularityEvent(event) {
  return axios.post('/p', event);
}
