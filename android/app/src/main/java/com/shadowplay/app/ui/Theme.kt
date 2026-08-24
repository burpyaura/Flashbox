package com.shadowplay.app.ui

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val ShadowColors = darkColorScheme(
    primary = Color(0xFFE50914), onPrimary = Color.White, background = Color(0xFF0D0D0D),
    surface = Color(0xFF1F1F1F), onSurface = Color.White, onBackground = Color.White,
    secondary = Color(0xFFAAAAAA), onSecondary = Color.White
)

@Composable fun ShadowPlayTheme(content: @Composable () -> Unit) {
    MaterialTheme(colorScheme = ShadowColors, content = content)
}
