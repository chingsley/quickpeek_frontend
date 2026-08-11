import { act, fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useActionSheet } from '@/components/shared/useActionSheet';

jest.mock('@/components/shared/ActionSheet', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ visible, title }: { visible: boolean; title: string }) =>
      visible ? React.createElement(View, { testID: 'action-sheet' }, React.createElement(Text, null, title)) : null,
  };
});

const Host = () => {
  const { showActionSheet, hideActionSheet, actionSheet } = useActionSheet();
  return (
    <View>
      <Pressable testID="open" onPress={() => showActionSheet({ title: 'Request sent' })}>
        <Text>open</Text>
      </Pressable>
      <Pressable testID="close" onPress={hideActionSheet}>
        <Text>close</Text>
      </Pressable>
      {actionSheet}
    </View>
  );
};

describe('useActionSheet', () => {
  it('opens the sheet after dismiss when using showActionSheetAfterDismiss', () => {
    jest.useFakeTimers();
    const HostAfterDismiss = () => {
      const { showActionSheetAfterDismiss, actionSheet } = useActionSheet();
      return (
        <View>
          <Pressable
            testID="open-after-dismiss"
            onPress={() => showActionSheetAfterDismiss({ title: 'Deferred' })}
          >
            <Text>open</Text>
          </Pressable>
          {actionSheet}
        </View>
      );
    };

    render(<HostAfterDismiss />);
    fireEvent.press(screen.getByTestId('open-after-dismiss'));
    expect(screen.queryByTestId('action-sheet')).toBeNull();

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(screen.getByText('Deferred')).toBeTruthy();
    jest.useRealTimers();
  });
  it('shows, updates and hides the sheet', () => {
    render(<Host />);
    expect(screen.queryByTestId('action-sheet')).toBeNull();

    fireEvent.press(screen.getByTestId('open'));
    expect(screen.getByText('Request sent')).toBeTruthy();

    fireEvent.press(screen.getByTestId('close'));
    expect(screen.queryByTestId('action-sheet')).toBeNull();
  });
});
