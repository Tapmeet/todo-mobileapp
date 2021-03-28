package com.app.conscientiousnesscoach;

import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
//import com.BV.LinearGradient.LinearGradientPackage;
//import com.github.wumke.RNLocalNotifications.RNLocalNotificationsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import org.pgsqlite.SQLitePluginPackage; //For SQLite database
//import com.wix.reactnativenotifications.RNNotificationsPackage;
import com.facebook.react.shell.MainReactPackage;
//import com.reactnativecommunity.art.ARTPackage;
//import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
//import org.unimodules.adapters.react.ModuleRegistryAdapter;
//import com.wix.reactnativekeyboardinput.KeyboardInputPackage;

import java.util.Arrays;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
//            packages.add(new RNNotificationsPackage(this.getApplication()));
//          packages.add(new ARTPackage());
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
//            packages.add(new RNDateTimePickerPackage());
//            packages.add(new SQLitePluginPackage());   // register SQLite Plugin here
           // packages.add(new KeyboardInputPackage(MainApplication.this));
            //packages.add(new RNNotificationsPackage(MainApplication.this));
           // packages.add(new ModuleRegistryAdapter(mModuleRegistryProvider));
//            packages.add(new ReactNativePushNotificationPackage());

//            return Arrays.<ReactPackage>asList(
//                    new MainReactPackage(),
            //new LinearGradientPackage(),
//                    new PackageList(this).getPackages(),
////                    // ...
//                    // Add this line:
//                    new RNNotificationsPackage(MainApplication.this)
//            );


          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this); // Remove this line if you don't want Flipper enabled
  }

  /**
   * Loads Flipper in React Native templates.
   *
   * @param context
   */
  private static void initializeFlipper(Context context) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.facebook.flipper.ReactNativeFlipper");
        aClass.getMethod("initializeFlipper", Context.class).invoke(null, context);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
