import { BOTTOM_SHEET_DISMISS_HANDOFF_MS } from '@/constants/bottomSheet';
import { runAfterOverlayDismiss } from '@/utils/runAfterOverlayDismiss';

describe('runAfterOverlayDismiss', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0);
      return 0;
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('runs the action after the bottom-sheet dismiss handoff', () => {
    const action = jest.fn();
    runAfterOverlayDismiss(action);

    expect(action).not.toHaveBeenCalled();

    jest.advanceTimersByTime(BOTTOM_SHEET_DISMISS_HANDOFF_MS - 1);
    expect(action).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(action).toHaveBeenCalledTimes(1);
  });

  it('cancels the deferred action when cleanup is called', () => {
    const action = jest.fn();
    const cancel = runAfterOverlayDismiss(action);
    cancel();

    jest.advanceTimersByTime(BOTTOM_SHEET_DISMISS_HANDOFF_MS);
    expect(action).not.toHaveBeenCalled();
  });
});
