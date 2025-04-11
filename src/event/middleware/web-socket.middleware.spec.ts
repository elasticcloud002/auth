import { WebSocketMiddleware } from './web-socket.middleware';

describe('WebSocketMiddleware', () => {
  it('should be defined', () => {
    expect(new WebSocketMiddleware()).toBeDefined();
  });
});
