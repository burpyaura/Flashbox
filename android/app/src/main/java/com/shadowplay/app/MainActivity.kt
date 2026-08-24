package com.shadowplay.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import com.shadowplay.app.ui.ShadowPlayTheme
import com.shadowplay.app.ui.home.HomeRoute

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { ShadowPlayTheme { HomeRoute() } }
    }
}
