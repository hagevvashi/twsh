import * as askModule from "../../src/lib/ask";
import localStorage from "../../src/lib/local-storage";
import login from "../../src/lib/login";
import changeUser from "../../src/app/change-user";

jest.mock("../../src/lib/login");

describe("action's test (Integration test)", () => {
  it("When changeUser method is called and login module returns error, that error is displayed as standard output.", async () => {
    const errorMessage = "something error";

    const askScreenNameSpy = jest.spyOn(askModule, "askScreenName");
    askScreenNameSpy.mockImplementation(
      async (): Promise<string> => "screen_name"
    );

    (login as jest.Mock).mockResolvedValue(
      new Promise((resolve) => resolve({ error: new Error(errorMessage) }))
    );

    const standardOutputSpy = jest
      .spyOn(process.stdout, "write")
      .mockImplementation((): boolean => true);

    await changeUser();

    expect(process.stdout.write).toBeCalledWith(`${new Error(errorMessage)}\n`);

    (login as jest.Mock).mockRestore();
    askScreenNameSpy.mockRestore();
    standardOutputSpy.mockRestore();
  });

  it("When changeUser method is called and login module returns no error, localStorage module's setItem method is Called with 'setItem' and 'screen_name'.", async () => {
    const askScreenNameSpy = jest.spyOn(askModule, "askScreenName");
    askScreenNameSpy.mockImplementation(
      async (): Promise<string> => "screen_name"
    );

    (login as jest.Mock).mockResolvedValue(
      new Promise((resolve) => resolve({ error: null }))
    );

    const setItemSpy = jest
      .spyOn(localStorage, "setItem")
      .mockImplementation((): null => null);

    await changeUser();

    expect(localStorage.setItem).toBeCalledWith("current_user", "screen_name");

    (login as jest.Mock).mockRestore();
    setItemSpy.mockRestore();
    askScreenNameSpy.mockRestore();
  });
});
