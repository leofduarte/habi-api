//# To run this test, use the following command:
// k6 run __tests__/load/loadTest.js

const http = require('k6/http');
const { check, sleep } = require('k6');

const BASE_URL = 'http://api.habi-app.pt';
//! this is a test token of a user with id 7 - do not use it in production
const BEARER_TOKEN_TEST = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjcsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImlhdCI6MTc0NjM5Nzc5MCwiZXhwIjoxNzQ3MjYxNzkwfQ.xr8NKy0l5hFJzjwWFVJcrYokQYabJ_tJbhbvlrXAtBU';
const USER_ID = 7;

const params = {
  headers: {
    Authorization: `Bearer ${BEARER_TOKEN_TEST}`,
  },
};

const endpoints = [
  '/api/v1/questions',
  '/api/v1/goals?userId=' + USER_ID,
  '/api/v1/missions?goalId=1',
  '/api/v1/prizes',
  '/api/v1/stats/' + USER_ID,
  '/api/v1/users/' + USER_ID,
  '/api/v1/daily-quotes?userId=' + USER_ID,
];

exports.default = function () {
  endpoints.forEach((endpoint) => {
    const res = http.get(`${BASE_URL}${endpoint}`, params);
    check(res, { [`${endpoint} status was 200`]: (r) => r.status === 200 });
    sleep(0.2);
  });
};

//# To run this test, use the following command:
// k6 run __tests__/load/loadTest.js