import { askTweet, askPin, askScreenName } from '../../src/lib/ask';

const promptReturnMock = 'promptReturnMock';

jest.mock('inquirer', () => ({
  prompt: jest.fn(async () => ({
    tweetContent: promptReturnMock,
    pin: promptReturnMock,
    screenName: promptReturnMock
  }))
}));

describe('test of ask module', () => {
  it(`calling askTweet returns ${promptReturnMock}`, async () => {
    expect(await askTweet()).toBe(promptReturnMock);
  });

  it(`calling askPin returns ${promptReturnMock}`, async () => {
    expect(await askPin('12345')).toBe(promptReturnMock);
  });

  it(`calling askScreenName returns ${promptReturnMock}`, async () => {
    expect(await askScreenName()).toBe(promptReturnMock);
  });
});
