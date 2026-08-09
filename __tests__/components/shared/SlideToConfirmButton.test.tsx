import { render, screen } from '@testing-library/react-native';
import React from 'react';
import SlideToConfirmButton from '@/components/shared/SlideToConfirmButton';

jest.mock('@expo/vector-icons/Ionicons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return ({ name }: { name: string }) => React.createElement(Text, null, name);
});

jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const { View } = require('react-native');
  const chain = {
    enabled: () => chain,
    activeOffsetX: () => chain,
    failOffsetY: () => chain,
    onBegin: () => chain,
    onUpdate: () => chain,
    onEnd: () => chain,
  };
  return {
    Gesture: {
      Pan: () => ({ ...chain }),
    },
    GestureDetector: ({ children }: { children: React.ReactNode }) =>
      React.createElement(View, { testID: 'gesture-detector' }, children),
  };
});

describe('SlideToConfirmButton', () => {
  it('renders the slide label and thumb', () => {
    render(<SlideToConfirmButton label="Slide to pay $3.00" onConfirm={jest.fn()} />);
    expect(screen.getAllByText('Slide to pay $3.00')).toHaveLength(2);
    expect(screen.getByTestId('slide-to-confirm-thumb')).toBeTruthy();
  });

  it('marks the control busy while loading before commit', () => {
    render(
      <SlideToConfirmButton label="Slide to pay $3.00" onConfirm={jest.fn()} loading />,
    );
    expect(screen.getByTestId('slide-to-confirm').props.accessibilityState).toEqual(
      expect.objectContaining({ busy: true, disabled: true }),
    );
  });

  it('returns to the slide state after processing ends without success', () => {
    const { rerender } = render(
      <SlideToConfirmButton label="Slide to pay $3.00" onConfirm={jest.fn()} loading />,
    );
    expect(screen.getByTestId('slide-to-confirm-status')).toHaveTextContent('Processing...');

    rerender(
      <SlideToConfirmButton
        label="Slide to pay $3.00"
        onConfirm={jest.fn()}
        loading={false}
        resetKey={1}
      />,
    );
    expect(screen.queryByTestId('slide-to-confirm-status')).toBeNull();
    expect(screen.getAllByText('Slide to pay $3.00')).toHaveLength(2);
  });

  it('shows the success label when payment completes', () => {
    render(
      <SlideToConfirmButton
        label="Slide to pay $3.00"
        onConfirm={jest.fn()}
        success
      />,
    );
    expect(screen.getByTestId('slide-to-confirm-status')).toHaveTextContent('Successful');
  });

  it('marks the control disabled when inactive', () => {
    render(
      <SlideToConfirmButton label="Slide to pay $3.00" onConfirm={jest.fn()} disabled />,
    );
    expect(screen.getByTestId('slide-to-confirm').props.accessibilityState).toEqual(
      expect.objectContaining({ disabled: true }),
    );
  });
});
