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
        ContinueItem("Solo Leveling", "S2 E15", "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=900", .72f),
        ContinueItem("Demon Slayer", "S4 E08", "https://images.unsplash.com/photo-1607604276583-eef5c071ddf8?w=900", .4f),
        ContinueItem("Attack on Titan", "S4 E19", "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=900", .86f)
    ),
    val popularMovies: List<Movie> = listOf(
        Movie("The Dark Knight", "2h 28m", "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=700"),
        Movie("Inception", "2h 28m", "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=700"),
        Movie("Interstellar", "2h 49m", "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=700"),
        Movie("Blade Runner", "1h 57m", "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=700")
    )
)

class HomeViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(HomeUiState())
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()
    fun selectCategory(value: String) { _uiState.value = _uiState.value.copy(selectedCategory = value) }
    fun selectNav(value: Int) { _uiState.value = _uiState.value.copy(selectedNav = value) }
}
