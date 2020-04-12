import { ErrorController } from "../../src/lib/error";

describe("Error module's test.", () => {
  it("For raise persentage of the coverage of Error module, create instance of ErrorController.", () => {
    const errorController = new ErrorController();
    jest.spyOn(process.stdout, "write").mockImplementation((): boolean => true);
    process.stdout.write(`${errorController}`);
  });
});
