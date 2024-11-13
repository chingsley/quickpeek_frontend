import React from 'react';
import { useSelector } from 'react-redux';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AppNavigator from '../navigation/AppNavigator';
import { usePermissions } from '../hooks/usePermissions';
import { useLocationUpdater } from '../hooks/useLocationUpdater';
import { RootState } from '../store';

const AppInitializer = () => {
  usePermissions(); // Initialize permissions once on app load
  useLocationUpdater(); // start periodic location update

  const permissionsLoaded = useSelector((state: RootState) => state.permissions.permissionsLoaded);
  if (!permissionsLoaded) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  return <AppNavigator />;
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Optional: set a background color for loader screen
  },
});


export default AppInitializer;
