import { EventEmitter } from '../src/lib/util';

test('EventEmitter', () => {
  const eventEmitter = new EventEmitter();

  expect(eventEmitter).toBeTruthy();

  const onclick1 = jest.fn();
  const onclick2 = jest.fn();
  const onclick3 = jest.fn();
  const ondblclick1 = jest.fn();
  const ondblclick2 = jest.fn();

  eventEmitter.on('click', onclick1);
  eventEmitter.on('click', onclick2);
  eventEmitter.on('click', onclick3);
  eventEmitter.on('dblclick', ondblclick1);
  eventEmitter.on('dblclick', ondblclick2);

  eventEmitter.emit('click', 'arg1', 'arg2');

  expect(onclick1).toHaveBeenCalledWith('arg1', 'arg2');
  expect(onclick2).toHaveBeenCalledWith('arg1', 'arg2');
  expect(onclick3).toHaveBeenCalledWith('arg1', 'arg2');
  expect(ondblclick1).not.toHaveBeenCalled();
  expect(ondblclick2).not.toHaveBeenCalled();

  eventEmitter.emit('dblclick', 'arg3');
  expect(ondblclick1).toBeCalledWith('arg3');
  expect(onclick1).toHaveBeenCalledTimes(1);

  eventEmitter.off('click', onclick1);
  eventEmitter.emit('click', 'arg1', 'arg2');
  expect(onclick1).toHaveBeenCalledTimes(1);
  expect(onclick2).toHaveBeenCalledTimes(2);
  expect(onclick3).toHaveBeenCalledTimes(2);

  eventEmitter.off('click', onclick2);
  eventEmitter.emit('click');
  expect(onclick2).toHaveBeenCalledTimes(2);
  expect(onclick3).toHaveBeenCalledTimes(3);

  eventEmitter.off('click', onclick3);
  eventEmitter.emit('click');
  expect(onclick3).toHaveBeenCalledTimes(3);

  eventEmitter.off();
  eventEmitter.emit('dblclick');
  expect(ondblclick1).toHaveBeenCalledTimes(1);
  expect(ondblclick2).toHaveBeenCalledTimes(1);
});
