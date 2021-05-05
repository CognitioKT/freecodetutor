import envData from '../../../config/env.json';
import axios from 'axios';
import cookies from 'browser-cookies';

const { apiLocation } = envData;

const base = apiLocation;

axios.defaults.withCredentials = true;

// csrf_token is passed to the client as a cookie. The client must send
// this back as a header.
function setCSRFTokens() {
  const csrfToken = typeof window !== 'undefined' && cookies.get('csrf_token');
  if (!csrfToken) return;
  axios.defaults.headers.post['CSRF-Token'] = csrfToken;
  axios.defaults.headers.put['CSRF-Token'] = csrfToken;
}

function get(path) {
  return axios.get(`${base}${path}`);
}

export function post(path, body) {
  setCSRFTokens();
  return axios.post(`${base}${path}`, body);
}

function put(path, body) {
  setCSRFTokens();
  return axios.put(`${base}${path}`, body);
}

// function del(path) {
//   return axios.delete(`${base}${path}`);
// }

/** GET **/

export function getSessionUser() {
  return get('/user/get-session-user');
}

export function getUserProfile(username) {
  return get(`/api/users/get-public-profile?username=${username}`);
}

export function getShowCert(username, certSlug) {
  return get(`/certificate/showCert/${username}/${certSlug}`);
}

export function getUsernameExists(username) {
  return get(`/api/users/exists?username=${username}`);
}

export function getArticleById(shortId) {
  return get(`/n/${shortId}`);
}

/** POST **/
export function postChargeStripe(body) {
  return post('/donate/charge-stripe', body);
}

export function addDonation(body) {
  return post('/donate/add-donation', body);
}

export function postCreateStripeSession(body) {
  return post('/donate/create-stripe-session', body);
}

export function putUpdateLegacyCert(body) {
  return post('/update-my-projects', body);
}

export function postReportUser(body) {
  return post('/user/report-user', body);
}

export function postDeleteAccount(body) {
  return post('/account/delete', body);
}

export function postResetProgress(body) {
  return post('/account/reset-progress', body);
}

/** PUT **/

export function putUpdateMyAbout(values) {
  return put('/update-my-about', { ...values });
}

export function putUpdateMyUsername(username) {
  return put('/update-my-username', { username });
}

export function putUpdateMyProfileUI(profileUI) {
  return put('/update-my-profileui', { profileUI });
}

export function putUpdateUserFlag(update) {
  return put('/update-user-flag', update);
}

export function putUserAcceptsTerms(quincyEmails) {
  return put('/update-privacy-terms', { quincyEmails });
}

export function putUserUpdateEmail(email) {
  return put('/update-my-email', { email });
}

export function putVerifyCert(certSlug) {
  return put('/certificate/verify', { certSlug });
}

/** DELETE **/
