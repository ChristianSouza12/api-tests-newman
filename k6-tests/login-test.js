import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 5,
  duration: '10s',
};

export default function () {
  const url = 'https://serverest.dev/login';

  const payload = JSON.stringify({
    email: 'teste@teste.com',
    password: '123456',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'status 200 ou 401': (r) => r.status === 200 || r.status === 401,
  });

  sleep(1);
}