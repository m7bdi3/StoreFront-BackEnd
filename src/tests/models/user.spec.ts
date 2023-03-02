import { UserCredentials, UserFront, User, UserStore } from '../../models/user';

const userStore = new UserStore();

describe('Model of User', () => {
  const user: UserCredentials = {
    username: 'jackjones',
    firstname: 'jack',
    lastname: 'jones',
    password: 'password123',
  };



  async function createUser(user: UserCredentials) {
    return userStore.createUser(user)

  }

  console.log(user);

  async function deleteTheUser(id: number) {
    return userStore.deleteUserById(id);
  }

  beforeAll(async () => {
    await userStore.truncate();

  })

  afterAll(async () => {
    await userStore.truncate();
  })

  beforeEach(async () => {
    await userStore.truncate();

  })

  it('Have The Get User Method', () => {
    expect(userStore.getUser).toBeDefined();
  });

  it('Have The Show Method', () => {
    expect(userStore.getUser).toBeDefined();
  });

  it('Have The Create Method', () => {
    expect(userStore.createUser).toBeDefined();
  });

  it('Have The Remove Method', () => {
    expect(userStore.deleteUserById).toBeDefined();
  });

  it('Createing The New User', async () => {
    const createdUser = await createUser(user);
    console.log(createdUser);

    if (createdUser) {

      expect(createdUser.username).toBe(user.username);

      expect(createdUser.firstname).toBe(user.firstname);
      expect(createdUser.lastname).toBe(user.lastname);
    }
    await deleteTheUser(createdUser.id);
  });

  it('Returning The List of Users', async () => {
    const createdUser = await createUser(user);
    console.log(createdUser);
    const result = await userStore.getUser();
    if (createdUser) {
      expect(result[0].username).toEqual('jackjones');
      expect(result[0].id).toEqual(1);
      expect(result[0].firstname).toEqual('jack');
      expect(result[0].lastname).toEqual('jones');
    }
    await deleteTheUser(createdUser.id);
  });

  it('Returning The Correct User', async () => {
    const createdUser: User = await createUser(user);
    const users = await userStore.getUserById(createdUser.id);
    expect(users).toEqual(createdUser);
    await deleteTheUser(createdUser.id);
  });

  it('Removing The User', async () => {
    const createdUser: User = await createUser(user);
    await deleteTheUser(createdUser.id);
    expect(createdUser.firstname).toEqual('jack');
    expect(createdUser.lastname).toEqual('jones');
  });

  it('Updating The User', async () => {
    const createdUser: User = await createUser(user);
    const newdataOfUser: UserFront = {
      firstname: 'sara',
      lastname: 'jack',
    };

    const { firstname, lastname } = await userStore.updateUser(createdUser.id, newdataOfUser);
    expect(firstname).toEqual(newdataOfUser.firstname);
    expect(lastname).toEqual(newdataOfUser.lastname);
    await deleteTheUser(createdUser.id);
  });
});
