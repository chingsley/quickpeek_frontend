type UserType = {
  id: string;
  name: string;
  username: string;
  email: string;
  deviceType: string;
  deviceToken: string;
  // locationSharingEnabled: boolean;
  notificationsEnabled: boolean;
  latitude?: number;
  longitude?: number;
};

export default UserType;