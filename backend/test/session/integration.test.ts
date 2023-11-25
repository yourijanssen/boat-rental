// import sinon from 'sinon';
// import { expect } from 'chai';
// import { Session } from '../../src/business/model/session';
// import { SessionService } from '../../src/business/service/session';
// import { SessionSequelizeDatabase } from '../../src/data/sequelize/session';
// import { User, Roles } from '../../src/business/model/user';
// import { UserSequelizeDatabase } from '../../src/data/sequelize/user';

// /**
//  * Integration tests for the SessionService.
//  * @author Thijs van Rixoort
//  */
// describe('Integration Tests: SessionService', (): void => {
//     describe(`login`, (): void => {
//         let sessionService: SessionService;
//         let createSessionStub: sinon.SinonStub;
//         let getUserByEmailStub: sinon.SinonStub;

//         beforeEach((): void => {
//             createSessionStub = sinon.stub(
//                 SessionSequelizeDatabase.prototype,
//                 'createSession'
//             );
//             getUserByEmailStub = sinon.stub(
//                 UserSequelizeDatabase.prototype,
//                 'getUserByEmail'
//             );
//             sessionService = new SessionService(
//                 new SessionSequelizeDatabase(),
//                 new UserSequelizeDatabase()
//             );
//         });

//         afterEach((): void => {
//             createSessionStub.restore();
//             getUserByEmailStub.restore();
//         });

//         it('should return a created session', async (): Promise<void> => {
//             // Arrange
//             const user: User = User.createUserWithId(
//                 1,
//                 'test@example.com',
//                 'TestPassword123!',
//                 Roles.USER,
//                 1
//             );

//             await user.hashPassword(user.getPassword);
//             getUserByEmailStub.resolves(user);

//             const session: Session = new Session(1);
//             createSessionStub.resolves(session);

//             const expected: Session = session;

//             // Act
//             const actual = await sessionService.login(
//                 'test@example.com',
//                 'TestPassword123!'
//             );

//             // Assert
//             expect(actual).to.deep.equal(expected);
//         });

//         it('should handle password validation', async (): Promise<void> => {
//             // Arrange
//             const user: User = User.createUserWithId(
//                 1,
//                 'test@example.com',
//                 'TestPassword123!',
//                 Roles.USER,
//                 1
//             );
//             await user.hashPassword(user.getPassword);
//             getUserByEmailStub.resolves(user);

//             const expected = 'Het e-mailadres of wachtwoord klopt niet.';

//             // Act
//             const actual: () => Promise<void> = async (): Promise<void> => {
//                 await sessionService.login(
//                     'test@example.com',
//                     'invalid-password'
//                 );
//             };

//             // Assert
//             await expect(actual()).to.be.rejectedWith(expected);
//         });

//         it('should handle email validation', async (): Promise<void> => {
//             // Arrange
//             const error: Error = new Error(
//                 'Het e-mailadres of wachtwoord klopt niet.'
//             );
//             getUserByEmailStub.throws(error);

//             const expected: Error = error;

//             // Act
//             const actual: () => Promise<void> = async (): Promise<void> => {
//                 await sessionService.login(
//                     'invalid@email.com',
//                     'TestPassword123!'
//                 );
//             };

//             // Assert
//             await expect(actual()).to.be.rejectedWith(expected);
//         });
//     });

//     describe(`logout`, (): void => {
//         let sessionService: SessionService;
//         let deleteSessionByIdStub: sinon.SinonStub;

//         beforeEach((): void => {
//             deleteSessionByIdStub = sinon.stub(
//                 SessionSequelizeDatabase.prototype,
//                 'deleteSessionById'
//             );

//             sessionService = new SessionService(
//                 new SessionSequelizeDatabase(),
//                 new UserSequelizeDatabase()
//             );
//         });

//         afterEach((): void => {
//             deleteSessionByIdStub.restore();
//         });

//         it('should handle errors when deleting a session by id', async (): Promise<void> => {
//             // Arrange
//             const error: Error = new Error(
//                 'Het uitloggen is helaas niet gelukt, probeer het later nog eens.'
//             );
//             deleteSessionByIdStub.throws(error);

//             const expected: Error = error;

//             // Act
//             const actual: () => Promise<void> = async (): Promise<void> => {
//                 await sessionService.logout('test@example.com');
//             };

//             // Assert
//             await expect(actual()).to.be.rejectedWith(expected);
//         });
//     });
// });
