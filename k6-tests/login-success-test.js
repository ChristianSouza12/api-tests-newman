import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 5,
  duration: '10s',
};

export default function () {
  const url = 'https://serverest.dev/login';

  const payload = JSON.stringify({
    email: 'teste1775496779567@email.com',
    password: '123456',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'status 200': (r) => r.status === 200,
    'retorna token': (r) => {
      const body = JSON.parse(r.body);
      return body.authorization !== undefined;
    },
  });

  sleep(1);
}