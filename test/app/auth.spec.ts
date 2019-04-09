import authenticate from '../../src/lib/authenticate';
import auth from '../../src/app/auth';
import login from '../../src/lib/login';
import localStorage from '../../src/lib/local-storage';

jest.mock('../../src/lib/login');
jest.mock('../../src/lib/authenticate');

describe("action's test (Integration test)", () => {
  it('When auth method is called and authenticate module returns error, that error is displayed as standard output.', async () => {
    (authenticate as jest.Mock).mockResolvedValue(
      new Promise(resolve =>
        resolve({ error: { statusCode: 0 }, screenName: 'screen_name' })
      )
    );

    const standardOutputSpy = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation((): boolean => true);

    await auth();

    expect(process.stdout.write).toBeCalledWith(`${{ statusCode: 0 }}\n`);

    (authenticate as jest.Mock).mockRestore();
    standardOutputSpy.mockRestore();
  });

  it('When auth method is called and authenticate module does not return error but login module returns error, that error is displayed as standard output.', async () => {
    const errorMessage: string = 'something error';

    (authenticate as jest.Mock).mockResolvedValue(
      new Promise(resolve =>
        resolve({ error: null, screenName: 'screen_name' })
      )
    );

    (login as jest.Mock).mockResolvedValue(
      new Promise(resolve => resolve({ error: new Error(errorMessage) }))
    );

    const standardOutputSpy = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation((): boolean => true);

    await auth();

    expect(process.stdout.write).toBeCalledWith(`${new Error(errorMessage)}\n`);

    (authenticate as jest.Mock).mockRestore();
    (login as jest.Mock).mockRestore();
    standardOutputSpy.mockRestore();
  });

  it("When auth method is called and neither authenticate nor login module returns error, localStorage module's setItem method is Called with 'setItem' and 'screen_name'.", async () => {
    (authenticate as jest.Mock).mockResolvedValue(
      new Promise(resolve =>
        resolve({ error: null, screenName: 'screen_name' })
      )
    );

    (login as jest.Mock).mockResolvedValue(
      new Promise(resolve => resolve({ error: null }))
    );

    const setItemSpy = jest
      .spyOn(localStorage, 'setItem')
      .mockImplementation(() => {});

    await auth();

    expect(localStorage.setItem).toBeCalledWith('current_user', 'screen_name');

    (authenticate as jest.Mock).mockRestore();
    (login as jest.Mock).mockRestore();
    setItemSpy.mockRestore();
  });
});
