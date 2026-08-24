package com.shadowplay.app.ui.home

import androidx.compose.runtime.Immutable
import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

@Immutable data class ContinueItem(val title: String, val episode: String, val image: String, val progress: Float)
@Immutable data class Movie(val title: String, val duration: String, val image: String)
@Immutable data class HomeUiState(
    val selectedCategory: String = "Home",
    val selectedNav: Int = 0,
    val continueWatching: List<ContinueItem> = listOf(
        ContinueItem("Jujutsu Kaisen", "S2 E15", "android.resource://com.shadowplay.app/drawable/jujutsu", .72f),
        ContinueItem("K.G.F: Chapter 2", "2h 48m", "android.resource://com.shadowplay.app/drawable/kgf", .58f),
        ContinueItem("Avengers: Endgame", "3h 1m", "android.resource://com.shadowplay.app/drawable/avengers", .86f),
        ContinueItem("Demon Slayer", "S3 E7", "android.resource://com.shadowplay.app/drawable/demon_slayer", .74f)
    ),
    val popularMovies: List<Movie> = listOf(
        Movie("Inception", "2h 28m", "android.resource://com.shadowplay.app/drawable/inception"),
        Movie("3 Idiots", "2h 50m", "android.resource://com.shadowplay.app/drawable/three_idiots"),
        Movie("Your Name.", "1h 46m", "android.resource://com.shadowplay.app/drawable/your_name"),
        Movie("Interstellar", "2h 49m", "android.resource://com.shadowplay.app/drawable/interstellar"),
        Movie("Spirited Away", "2h 04m", "android.resource://com.shadowplay.app/drawable/spirited_away")
    )
)

class HomeViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(HomeUiState())
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()
    fun selectCategory(value: String) { _uiState.value = _uiState.value.copy(selectedCategory = value) }
    fun selectNav(value: Int) { _uiState.value = _uiState.value.copy(selectedNav = value) }
}
