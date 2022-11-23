const request = require('supertest');
const { HTTP_STATUS_CODE } = require('../../configs/constants');
const { app } = require('../../server');
const recaptcha_key = process.env.RECAPTCHA_SECRET;

describe('User APIs Test Cases', () => {

  beforeEach(() => {
  });

  beforeAll(() => {
  });

  afterEach(() => {
    
  });

  afterAll(() => {
  });

  describe(`/POST login`, () => {
    it('Missing parameters - should return code 400', async () => {
      const response = await request(app)
        .post(`/user/login`)
        .send({
          email: '',
          password: ''
        });
      expect(response.statusCode).toBe(HTTP_STATUS_CODE.BAD_REQUEST);
    });
    it('invalid email address - it should return code 400', async () => {
      const response = await request(app)
        .post(`/user/login`)
        .send({
          email: 'abcgamil.com',
        });
      expect(response.statusCode).toBe(HTTP_STATUS_CODE.BAD_REQUEST);
    });
  });

  describe(`/POST register`, () => {
    it('it should return status code 400 - Missing Parameters', async () => {
      const response = await request(app)
        .post(`/user/register`)
        .send({
          username: "abc",
          email: "abc.com",
        })
      // console.log("respose=======> ", response)
      expect(response.body).toBe("Missing Required Paramterse");
    })
    it('it should return status code 400 - Bad Request', async () => {
      const response = await request(app)
        .post(`/user/register`)
        .send({
          username: "test12345 name",
          email: "test546756@gmail.com",
        });
      // console.log("respose=======> ", response)
      expect(response.statusCode).toBe(HTTP_STATUS_CODE.BAD_REQUEST);
    })
    it('it should return status code 400 - Bad Request', async () => {
      const response = await request(app)
        .post(`/user/register`)
        .send({
          username: "test45 name",
          email: "test34345@gmail.com",
        })
      // console.log("respose=======> ", response);
      expect(response.statusCode).toBe(HTTP_STATUS_CODE.BAD_REQUEST);
    })
  });

  describe(`/PUT update password`, () => {
    it('it should return status code 401- UnAuthorized', async () => {
      const response = await request(app)
        .put(`/user/update-password`)
      expect(response.statusCode).toBe(HTTP_STATUS_CODE.UNAUTHORIZED);
      expect(response.body).toBe("No token available, authorization denied!")
    })
    it('it should return status code 201 - CREATED', async () => {
      const response = await request(app)
        .put(`/user/update-password`)
        .set('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxOWY3ZTBjNTBjZWQ3MTgwNzllYzViZSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjM3OTA2MTYyfQ.Cb8ftYK_ljvHANkBtWWDV6w06aXpUDdczaFqNmutrxg')
      // console.log("response =====> ", response)
      expect(response.statusCode).toBe(HTTP_STATUS_CODE.CREATED);
      expect(response.body.success).toBe(true);
    })
  });
    
  describe('/PUT updateUser', () => {
    it('it should return status code 401- UnAuthorized', async () => {
      const response = await request(app)
        .put(`/user/updateUser`)
      expect(response.statusCode).toBe(HTTP_STATUS_CODE.UNAUTHORIZED);
      expect(response.body).toBe("No token available, authorization denied!")
    })
    it('it should return status code 400 - Bad Request', async () => {
      const response = await request(app)
        .put(`/user/updateUser`)
        .set('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxOWY3ZTBjNTBjZWQ3MTgwNzllYzViZSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjM3OTA2MTYyfQ.Cb8ftYK_ljvHANkBtWWDV6w06aXpUDdczaFqNmutrxg')
        .send({
          username: "",
          email: "",
          phone: "",
        })
      // console.log("response =======> ", response);
      expect(response.statusCode).toBe(HTTP_STATUS_CODE.BAD_REQUEST);
      expect(response.body.message).toBe("Required parameters are missing")
    })
    it('it should return status code 201 - Created', async () => {
      const response = await request(app)
        .put(`/user/updateUser`)
        .set('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxOWY3ZTBjNTBjZWQ3MTgwNzllYzViZSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjM3OTA2MTYyfQ.Cb8ftYK_ljvHANkBtWWDV6w06aXpUDdczaFqNmutrxg')
        .send({
          username: "abc user",
          email: "abc@gmail.com",
        })
      // console.log("response =======> ", response);
      expect(response.statusCode).toBe(HTTP_STATUS_CODE.CREATED);
    })
  })
})
