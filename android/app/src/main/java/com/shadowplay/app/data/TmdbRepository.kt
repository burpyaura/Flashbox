package com.shadowplay.app.data

import com.shadowplay.app.ui.home.ContinueItem
import com.shadowplay.app.ui.home.Movie
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

class TmdbRepository {
    private val key = "9e38d1ffc33df9e31544cdcaf6ccabba"
    private val base = "https://api.themoviedb.org/3"
    private val image = "https://image.tmdb.org/t/p/w500"

    suspend fun popularMovies(): List<Movie> = request("/movie/top_rated").map { movie ->
        Movie(movie.title, movie.duration, image + movie.poster)
    }

    suspend fun trending(): List<ContinueItem> = request("/trending/all/day").take(4).map { item ->
        ContinueItem(item.title, item.year, image + item.poster, .72f)
    }

    private fun request(path: String): List<ApiItem> {
        val connection = URL("$base$path?api_key=$key").openConnection() as HttpURLConnection
        return try {
            connection.connectTimeout = 8000
            connection.readTimeout = 8000
            val body = connection.inputStream.bufferedReader().use { it.readText() }
            val results = JSONObject(body).getJSONArray("results")
            buildList {
                for (index in 0 until results.length()) {
                    val json = results.getJSONObject(index)
                    add(ApiItem(json.optString("title", json.optString("name", "Untitled")), json.optString("poster_path"), json.optString("release_date", json.optString("first_air_date")).take(4).ifBlank { "S1 E1" }, json.optString("runtime").ifBlank { "Movie" }))
                }
            }
        } finally { connection.disconnect() }
    }

    private data class ApiItem(val title: String, val poster: String, val year: String, val duration: String)
}
