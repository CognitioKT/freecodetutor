/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { defaultUserEmail, setupServer, superRequest } from '../../jest.utils';

// TODO: replace dev login with the /signin, /signout routes
describe('dev login', () => {
  setupServer();
  beforeEach(async () => {
    await fastifyTestInstance.prisma.user.deleteMany({
      where: { email: defaultUserEmail }
    });
  });

  afterAll(async () => {
    await fastifyTestInstance.prisma.user.deleteMany({
      where: { email: defaultUserEmail }
    });
  });

  it('should create an account if one does not exist', async () => {
    const res = await superRequest('/auth/dev-callback', { method: 'GET' });

    const count = await fastifyTestInstance.prisma.user.count({
      where: { email: defaultUserEmail }
    });

    expect(count).toBe(1);

    expect(res.body).toStrictEqual({ statusCode: 200 });
    expect(res.status).toBe(200);
  });

  it('should populate the user with the correct data', async () => {
    const uuidRe = /^[a-f0-9]{8}-([a-f0-9]{4}-){3}[a-f0-9]{12}$/;
    const fccUuidRe = /^fcc-[a-f0-9]{8}-([a-f0-9]{4}-){3}[a-f0-9]{12}$/;

    await superRequest('/auth/dev-callback', { method: 'GET' });
    const user = await fastifyTestInstance.prisma.user.findFirstOrThrow({
      where: { email: defaultUserEmail }
    });

    expect(user).toMatchObject({
      about: '',
      acceptedPrivacyTerms: false,
      completedChallenges: [],
      currentChallengeId: '',
      email: defaultUserEmail,
      emailVerified: true,
      externalId: expect.stringMatching(uuidRe),
      is2018DataVisCert: false,
      is2018FullStackCert: false,
      isApisMicroservicesCert: false,
      isBackEndCert: false,
      isBanned: false,
      isCheater: false,
      isDataAnalysisPyCertV7: false,
      isDataVisCert: false,
      isDonating: false,
      isFrontEndCert: false,
      isFrontEndLibsCert: false,
      isFullStackCert: false,
      isHonest: false,
      isInfosecCertV7: false,
      isInfosecQaCert: false,
      isJsAlgoDataStructCert: false,
      isMachineLearningPyCertV7: false,
      isQaCertV7: false,
      isRelationalDatabaseCertV8: false,
      isCollegeAlgebraPyCertV8: false,
      isRespWebDesignCert: false,
      isSciCompPyCertV7: false,
      keyboardShortcuts: false,
      location: '',
      name: '',
      unsubscribeId: '',
      picture: '',
      profileUI: {
        isLocked: false,
        showAbout: false,
        showCerts: false,
        showDonation: false,
        showHeatMap: false,
        showLocation: false,
        showName: false,
        showPoints: false,
        showPortfolio: false,
        showTimeLine: false
      },
      progressTimestamps: [],
      sendQuincyEmail: false,
      theme: 'default',
      username: expect.stringMatching(fccUuidRe),
      usernameDisplay: expect.stringMatching(fccUuidRe)
    });
    expect(user.username).toBe(user.usernameDisplay);
  });
});

describe('dev login take 2', () => {
  setupServer();

  beforeEach(async () => {
    await fastifyTestInstance.prisma.user.deleteMany({
      where: { email: defaultUserEmail }
    });
  });

  afterAll(async () => {
    await fastifyTestInstance.prisma.user.deleteMany({
      where: { email: defaultUserEmail }
    });
  });

  describe('GET /signin', () => {
    it('should create an account if one does not exist', async () => {
      const res = await superRequest('/signin', { method: 'GET' });

      const count = await fastifyTestInstance.prisma.user.count({
        where: { email: defaultUserEmail }
      });

      expect(count).toBe(1);
      expect(res.body).toStrictEqual({});
    });

    it('should set the jwt_access_token cookie', async () => {
      const res = await superRequest('/signin', { method: 'GET' });

      expect(res.status).toBe(302);
      expect(res.headers['set-cookie']).toEqual(
        expect.arrayContaining([expect.stringMatching(/jwt_access_token=/)])
      );
      // TODO: check the cookie value
    });

    it.todo('should create a session');

    it('should redirect to the Referer', async () => {
      const res = await superRequest(
        '/signin',
        { method: 'GET' },
        // referer must be one of the allowed origins (www.freecodecamp.org is
        // allowed)
        { headers: { referer: 'https://www.freecodecamp.org/espanol/learn' } }
      );

      expect(res.status).toBe(302);
      expect(res.headers.location).toBe(
        'https://www.freecodecamp.org/espanol/learn'
      );
    });
  });
});
