import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.32e84db4baec4d178ec9566ab471cd88',
  appName: 'cortel-vigil-stream',
  webDir: 'dist',
  server: {
    url: 'https://32e84db4-baec-4d17-8ec9-566ab471cd88.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#004A7C'
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#004A7C',
      showSpinner: false
    }
  }
};

export default config;