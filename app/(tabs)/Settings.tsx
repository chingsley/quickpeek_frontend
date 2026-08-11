import SettingsPanel from '@/components/SettingsPanel';
import { ScreenTitle } from '@/components/shared/ScreenTitle';
import { colors } from '@/constants/colors';
import { screenChromeStyles } from '@/constants/screenChrome';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Settings = () => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={screenChromeStyles.titleRowStandalone}>
        <ScreenTitle title="Settings" />
      </View>
      <SettingsPanel />
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.BG_WHITE,
  },
});
