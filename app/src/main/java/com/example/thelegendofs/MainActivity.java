package com.example.thelegendofs;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.res.Configuration;
import android.os.Bundle;
import android.webkit.WebView;

public class MainActivity extends AppCompatActivity {

    private WebView web;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        startGame();
    }

    @Override
    public void onConfigurationChanged(@NonNull Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
    }

    private void startGame() {
        web = findViewById(R.id.webView);
        web.getSettings().setJavaScriptEnabled(true);
        hideBars();
        web.loadUrl("file:///android_asset/Game/index.html");
    }

    private void hideBars() {
        WindowInsetsControllerCompat viewController = WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
        viewController.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
        viewController.hide(WindowInsetsCompat.Type.systemBars());
    }

    private void alert(String t) {
        AlertDialog.Builder msg = new AlertDialog.Builder(this);
        msg.setPositiveButton("OK", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                dialogInterface.cancel();
            }
        });
        msg.setMessage(t).show();
    }
}