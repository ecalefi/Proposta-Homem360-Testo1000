/**
 * Utility to handle Browser Notifications
 */

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!("Notification" in window)) {
    console.warn("This browser does not support desktop notification");
    return false;
  }

  let permission = Notification.permission;

  if (permission === "granted") {
    return true;
  } else if (permission !== "denied") {
    permission = await Notification.requestPermission();
    return permission === "granted";
  }
  return false;
};

export const sendNotification = (title: string, options?: NotificationOptions) => {
  if (!("Notification" in window)) return;

  if (Notification.permission === "granted") {
    new Notification(title, {
      icon: 'https://cdn-icons-png.flaticon.com/512/3063/3063822.png', // Generic medical icon
      badge: 'https://cdn-icons-png.flaticon.com/512/3063/3063822.png',
      ...options
    });
  } else {
    console.log("Notification permission not granted");
  }
};

export const getPermissionStatus = () => {
  if (!("Notification" in window)) return 'unsupported';
  return Notification.permission;
};