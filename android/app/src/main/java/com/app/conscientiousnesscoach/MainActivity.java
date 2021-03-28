package com.app.conscientiousnesscoach;

import com.facebook.react.ReactActivity;
import android.content.Context;
import android.app.NotificationManager;

public class MainActivity extends ReactActivity {
  @Override
  public void onResume() {
    super.onResume();
    NotificationManager nMgr = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
    nMgr.cancelAll();
  }
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "CCoach";
  }
}
