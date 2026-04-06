import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 5,
  duration: '10s',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
  },
};

export default function () {
  const loginUrl = 'https://serverest.dev/login';

  const loginPayload = JSON.stringify({
    email: 'teste1775496779567@email.com',
    password: '123456',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const loginRes = http.post(loginUrl, loginPayload, params);

  check(loginRes, {
    'login status 200': (r) => r.status === 200,
    'login retorna token': (r) => JSON.parse(r.body).authorization !== undefined,
  });

  const tokenBruto = JSON.parse(loginRes.body).authorization;
  const token = tokenBruto.replace(/^Bearer\s+/i, '');

  const productUrl = 'https://serverest.dev/produtos';

  const productPayload = JSON.stringify({
    nome: `Produto K6 ${Date.now()}`,
    preco: 100,
    descricao: 'Produto criado via K6',
    quantidade: 10,
  });

  const authParams = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const productRes = http.post(productUrl, productPayload, authParams);

  check(productRes, {
    'produto status 201': (r) => r.status === 201,
    'produto criado com sucesso': (r) =>
      JSON.parse(r.body).message === 'Cadastro realizado com sucesso',
  });

  sleep(1);
}