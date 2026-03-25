import { sleep, check, group, fail } from 'k6'
import http from 'k6/http'
import jsonpath from 'https://jslib.k6.io/jsonpath/1.0.2/index.js'

export const options = {
  cloud: {
    distribution: { 'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 100 } },
    apm: [],
  },
  thresholds: {},
  scenarios: {
    Login_and_purchase: {
      executor: 'ramping-vus',
      gracefulStop: '30s',
      stages: [
        { target: 10, duration: '10s' },
        { target: 50, duration: '30s' },
        { target: 20, duration: '20s' },
        { target: 0, duration: '10s' },
      ],
      gracefulRampDown: '30s',
      exec: 'login_and_purchase',
    },
  },
}

// Scenario: Login_and_purchase (executor: ramping-vus)

export function login_and_purchase() {
  let response

  const vars = {}

  // login
  response = http.put(
    'https://pizza-service.pizza-factory-mrm-franchise.click/api/auth',
    '{"email":"d@jwt.com","password":"diner"}',
    {
      headers: {
        accept: '*/*',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'en-US,en;q=0.9,ja;q=0.8,zh-CN;q=0.7,zh;q=0.6',
        'content-type': 'application/json',
        origin: 'https://pizza.pizza-factory-mrm-franchise.click',
        priority: 'u=1, i',
        'sec-ch-ua': '"Not(A:Brand";v="8", "Chromium";v="144", "Opera GX";v="128"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
      },
    }
  )

  if (!check(response, { 'status equals 200': response => response.status.toString() === '200' })) {
    console.log(response.body);
    fail('Login was *not* 200');
  }

  vars['token'] = jsonpath.query(response.json(), '$.token')[0]

  sleep(5.4)

  // get menu
  response = http.get('https://pizza-service.pizza-factory-mrm-franchise.click/api/order/menu', {
    headers: {
      accept: '*/*',
      'accept-encoding': 'gzip, deflate, br, zstd',
      'accept-language': 'en-US,en;q=0.9,ja;q=0.8,zh-CN;q=0.7,zh;q=0.6',
      authorization: `Bearer ${vars['token']}`,
      'content-type': 'application/json',
      'if-none-match': 'W/"1fc-cgG/aqJmHhElGCplQPSmgl2Gwk0"',
      origin: 'https://pizza.pizza-factory-mrm-franchise.click',
      priority: 'u=1, i',
      'sec-ch-ua': '"Not(A:Brand";v="8", "Chromium";v="144", "Opera GX";v="128"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
    },
  })

  // get franchises
  response = http.get(
    'https://pizza-service.pizza-factory-mrm-franchise.click/api/franchise?page=0&limit=20&name=*',
    {
      headers: {
        accept: '*/*',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'en-US,en;q=0.9,ja;q=0.8,zh-CN;q=0.7,zh;q=0.6',
        authorization: `Bearer ${vars['token']}`,
        'content-type': 'application/json',
        'if-none-match': 'W/"5c-UrU6FPurLC0JcnOrzddwdfUXFBA"',
        origin: 'https://pizza.pizza-factory-mrm-franchise.click',
        priority: 'u=1, i',
        'sec-ch-ua': '"Not(A:Brand";v="8", "Chromium";v="144", "Opera GX";v="128"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
      },
    }
  )
  sleep(8.3)

  // start order
  response = http.get('https://pizza-service.pizza-factory-mrm-franchise.click/api/user/me', {
    headers: {
      accept: '*/*',
      'accept-encoding': 'gzip, deflate, br, zstd',
      'accept-language': 'en-US,en;q=0.9,ja;q=0.8,zh-CN;q=0.7,zh;q=0.6',
      authorization: `Bearer ${vars['token']}`,
      'content-type': 'application/json',
      'if-none-match': 'W/"5d-CrFGUL3pfyZhPAcviuVcValv3bk"',
      origin: 'https://pizza.pizza-factory-mrm-franchise.click',
      priority: 'u=1, i',
      'sec-ch-ua': '"Not(A:Brand";v="8", "Chromium";v="144", "Opera GX";v="128"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
    },
  })
  sleep(2.2)

  // make order
  response = http.post(
    'https://pizza-service.pizza-factory-mrm-franchise.click/api/order',
    '{"items":[{"menuId":1,"description":"Veggie","price":0.0038},{"menuId":2,"description":"Pepperoni","price":0.0042}],"storeId":"1","franchiseId":1}',
    {
      headers: {
        accept: '*/*',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'en-US,en;q=0.9,ja;q=0.8,zh-CN;q=0.7,zh;q=0.6',
        authorization: `Bearer ${vars['token']}`,
        'content-type': 'application/json',
        origin: 'https://pizza.pizza-factory-mrm-franchise.click',
        priority: 'u=1, i',
        'sec-ch-ua': '"Not(A:Brand";v="8", "Chromium";v="144", "Opera GX";v="128"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
      },
    }
  )
  sleep(8.9)

  // verify order
  response = http.post(
    'https://pizza-factory.cs329.click/api/order/verify',
    '{"jwt":"eyJpYXQiOjE3NzQ0MDg5OTksImV4cCI6MTc3NDQ5NTM5OSwiaXNzIjoiY3MzMjkuY2xpY2siLCJhbGciOiJSUzI1NiIsImtpZCI6Ik9TcF94VzhlM3kwNk1KS3ZIeW9sRFZMaXZXX2hnTWxhcFZSUVFQVndiY0UifQ.eyJ2ZW5kb3IiOnsiaWQiOiJtcm0yMDAzIiwibmFtZSI6Ik1heCBNaWxsZXIifSwiZGluZXIiOnsiaWQiOjIsIm5hbWUiOiJwaXp6YSBkaW5lciIsImVtYWlsIjoiZEBqd3QuY29tIn0sIm9yZGVyIjp7Iml0ZW1zIjpbeyJtZW51SWQiOjEsImRlc2NyaXB0aW9uIjoiVmVnZ2llIiwicHJpY2UiOjAuMDAzOH0seyJtZW51SWQiOjIsImRlc2NyaXB0aW9uIjoiUGVwcGVyb25pIiwicHJpY2UiOjAuMDA0Mn1dLCJzdG9yZUlkIjoiMSIsImZyYW5jaGlzZUlkIjoxLCJpZCI6MjEzMjZ9fQ.FRIVvB9USIptOwJmDWsP6Lr_TAVRVBMp48GOPm79X-JZncbWmoEOsBt3rF5e_b1Mnfff0l6hMgRLjPV30eqJos_cfDQw4yGYptzCMJh5wER-zXgtqy9i6Tj0QFYjLCjjIhrNTRage2PQA1W3NY5uigKZkykNNloZEzsIm6n5OOtXDRH90DCLUYN5sm8irE4KEHbxt9twU3GtEjsQXEpQFRVUTG92JesOcn63_aVafv2T7AA5fpaOkw7DmBbCfWpITjvbgb5KiNIbhk8K285S3wmPir2NrPwjA2G5CFtnQVjEKkFhwkiCxzEQ5wyDtN5dQuU2YnTRgKCgH9O6g8tNQQdacIMEuULNoJEBvLAQ5Jr6Pneh9VujsMiIdvjX2f04S98mKNTrosTzC4uPUdLMFqF1CPa-7NjrVd-XrKuSR6H4HNauwJJZHOcKXrd70mEnxa7fEwXoCq2TWNr75jrqOPZyTd_MY-rE2Q8K7fZF4Uekzw_k5P_Y2eYSUlf8a_l0bHCtU12u8M_HwuDjrqqdNLwLBPyMFLGhf2iG-SGBC9isSMc0LwG_gHFioIoaHmlm21aYY-D4fwKNjlizD7maKUgQxpp1qkFGGUa7iQiYGujRftwMQCBXz_rdgO0jPwxKlABH5_cXpCvgHs07ODLOXbN9ZRxICaiMY5smra0xaY4"}',
    {
      headers: {
        accept: '*/*',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'en-US,en;q=0.9,ja;q=0.8,zh-CN;q=0.7,zh;q=0.6',
        authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6InBpenphIGRpbmVyIiwiZW1haWwiOiJkQGp3dC5jb20iLCJyb2xlcyI6W3sicm9sZSI6ImRpbmVyIn1dLCJpYXQiOjE3NzQ0MDg5Nzl9.IGihCJ2YN5NMkwnZmINmOms8DwFtk-AxvSJfPqGe1Lo',
        'content-type': 'application/json',
        origin: 'https://pizza.pizza-factory-mrm-franchise.click',
        priority: 'u=1, i',
        'sec-ch-ua': '"Not(A:Brand";v="8", "Chromium";v="144", "Opera GX";v="128"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'sec-fetch-storage-access': 'active',
      },
    }
  )

  sleep(2)

  // logout
  response = http.del('https://pizza-service.pizza-factory-mrm-franchise.click/api/auth', null, {
    headers: {
      accept: '*/*',
      'accept-encoding': 'gzip, deflate, br, zstd',
      'accept-language': 'en-US,en;q=0.9,ja;q=0.8,zh-CN;q=0.7,zh;q=0.6',
      authorization: `Bearer ${vars['token']}`,
      'content-type': 'application/json',
      origin: 'https://pizza.pizza-factory-mrm-franchise.click',
      priority: 'u=1, i',
      'sec-ch-ua': '"Not(A:Brand";v="8", "Chromium";v="144", "Opera GX";v="128"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
    },
  })
}