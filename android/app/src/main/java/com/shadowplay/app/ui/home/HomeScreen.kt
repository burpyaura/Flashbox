package com.shadowplay.app.ui.home

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccessTime
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.Tv
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.foundation.border
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import coil.compose.AsyncImage

private val Red = Color(0xFFE50914)
private val Muted = Color(0xFFAAAAAA)
private val Card = Color(0xFF1A1A1A)

@Composable
fun HomeRoute(vm: HomeViewModel = viewModel()) {
    val state by vm.uiState.collectAsStateWithLifecycle()
    HomeScreen(state, vm::selectCategory, vm::selectNav)
}

@Composable
private fun HomeScreen(state: HomeUiState, onCategory: (String) -> Unit, onNav: (Int) -> Unit) {
    ScaffoldWithNav(state.selectedNav, onNav) {
        LazyColumn(Modifier.fillMaxSize().background(Color(0xFF0C0C0C)), contentPadding = androidx.compose.foundation.layout.PaddingValues(bottom = 12.dp)) {
            item { Header(state.selectedCategory, onCategory) }
            item { HeroBanner() }
            item { SectionHeader("Categories", null) }
            item { CategoryGrid() }
            item { SectionHeader("Continue Watching", "View All") }
            item { ContinueRow(state.continueWatching) }
            item { SectionHeader("Popular Movies", "View All") }
            item { MovieRow(state.popularMovies) }
        }
    }
}

@Composable private fun ScaffoldWithNav(selected: Int, onNav: (Int) -> Unit, content: @Composable () -> Unit) {
    androidx.compose.material3.Scaffold(containerColor = Color(0xFF0C0C0C), bottomBar = {
        Row(Modifier.fillMaxWidth().background(Color(0xFF151515)).navigationBarsPadding().height(56.dp), horizontalArrangement = Arrangement.SpaceEvenly, verticalAlignment = Alignment.CenterVertically) {
            listOf(Icons.Default.PlayArrow to "Home", Icons.Default.AccessTime to "Recent Watch", Icons.Default.Download to "Downloads", Icons.Default.Person to "Profile").forEachIndexed { i, pair ->
                Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.width(80.dp).clickable { onNav(i) }) {
                    Icon(pair.first, pair.second, tint = if (selected == i) Red else Muted, modifier = Modifier.size(21.dp))
                    Spacer(Modifier.height(5.dp)); Text(pair.second, color = if (selected == i) Color.White else Muted, fontSize = 10.sp, fontWeight = if (selected == i) FontWeight.Bold else FontWeight.Normal)
                }
            }
        }
    }) { padding -> Box(Modifier.padding(padding)) { content() } }
}

@Composable private fun Header(selected: String, onCategory: (String) -> Unit) {
    Column(Modifier.padding(top = 16.dp, bottom = 8.dp)) {
        Row(Modifier.fillMaxWidth().padding(horizontal = 12.dp), verticalAlignment = Alignment.CenterVertically) {
            Icon(Icons.Default.PlayArrow, null, tint = Red, modifier = Modifier.size(18.dp))
            Spacer(Modifier.width(9.dp)); Text("SHADOW", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.ExtraBold, letterSpacing = 1.5.sp); Text(" PLAY", color = Red, fontSize = 18.sp, fontWeight = FontWeight.ExtraBold, letterSpacing = 1.5.sp)
            Spacer(Modifier.weight(1f)); IconButton(onClick = {}) { Icon(Icons.Default.Search, "Search", tint = Color.White) }
        }
        Row(Modifier.padding(start = 12.dp, top = 12.dp).horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(9.dp)) {
            listOf("Home", "Movies", "Anime", "TV Shows").forEach { label -> Surface(onClick = { onCategory(label) }, color = if (selected == label) Red else Card, shape = RoundedCornerShape(20.dp)) { Text(label, color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.SemiBold, modifier = Modifier.padding(horizontal = 17.dp, vertical = 9.dp)) } }
        }
    }
}

@Composable private fun HeroBanner() {
    Box(Modifier.fillMaxWidth().height(210.dp).padding(horizontal = 12.dp).clip(RoundedCornerShape(12.dp))) {
        AsyncImage("android.resource://com.shadowplay.app/drawable/hero_art", "Solo Leveling hero", Modifier.fillMaxSize(), contentScale = ContentScale.Crop)
        Box(Modifier.fillMaxSize().background(Brush.horizontalGradient(listOf(Color(0xF20D0D0D), Color(0x880D0D0D), Color.Transparent))))
        Box(Modifier.fillMaxSize().background(Brush.verticalGradient(listOf(Color.Transparent, Color(0xE60D0D0D)))))
        Column(Modifier.align(Alignment.BottomStart).padding(20.dp)) {
            Text("TRENDING NOW", color = Red, fontSize = 10.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.5.sp)
            Spacer(Modifier.height(7.dp)); Text("SOLO LEVELING", color = Color.White, fontSize = 22.sp, lineHeight = 24.sp, fontWeight = FontWeight.ExtraBold); Text("SEASON 2", color = Red, fontSize = 12.sp, lineHeight = 16.sp, fontWeight = FontWeight.ExtraBold)
            Spacer(Modifier.height(7.dp)); Text("Sung Jinwoo rises from the shadows to\nface a new level of danger.", color = Color(0xFFD0D0D0), fontSize = 11.sp, lineHeight = 14.sp)
            Spacer(Modifier.height(14.dp)); Surface(onClick = {}, color = Red, shape = RoundedCornerShape(7.dp)) { Row(Modifier.padding(horizontal = 14.dp, vertical = 10.dp), verticalAlignment = Alignment.CenterVertically) { Icon(Icons.Default.PlayArrow, null, tint = Color.White, modifier = Modifier.size(17.dp)); Spacer(Modifier.width(5.dp)); Text("Watch Now", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 12.sp) } }
        }
        Row(Modifier.align(Alignment.BottomEnd).padding(20.dp), horizontalArrangement = Arrangement.spacedBy(5.dp)) { repeat(4) { Box(Modifier.size(if (it == 0) 17.dp else 5.dp, 5.dp).clip(CircleShape).background(if (it == 0) Red else Color(0xFF777777))) } }
    }
}

@Composable private fun SectionHeader(title: String, action: String?) { Row(Modifier.fillMaxWidth().padding(start = 20.dp, end = 20.dp, top = 16.dp, bottom = 8.dp), verticalAlignment = Alignment.CenterVertically) { Text(title, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 15.sp); Spacer(Modifier.weight(1f)); action?.let { Text(it, color = Red, fontSize = 12.sp, fontWeight = FontWeight.SemiBold) } } }

@Composable private fun CategoryGrid() { val categories = listOf("Anime" to Icons.Default.Star, "Bollywood" to Icons.Default.Tv, "Hollywood" to Icons.Default.Star, "TV Shows" to Icons.Default.Tv); Row(Modifier.fillMaxWidth().padding(horizontal = 12.dp), horizontalArrangement = Arrangement.spacedBy(12.dp)) { categories.forEach { (name, icon) -> Surface(Modifier.weight(1f).height(70.dp), color = Card, shape = RoundedCornerShape(10.dp), onClick = {}) { Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Center) { Icon(icon, null, tint = Red, modifier = Modifier.size(22.dp)); Spacer(Modifier.height(10.dp)); Text(name, color = Color.White, fontSize = 11.sp, fontWeight = FontWeight.Medium) } } } } }

@Composable private fun ContinueRow(items: List<ContinueItem>) { LazyRow(contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 12.dp), horizontalArrangement = Arrangement.spacedBy(12.dp)) { items(items, key = { it.title }) { item -> Box(Modifier.width(140.dp).height(180.dp).clip(RoundedCornerShape(10.dp))) { AsyncImage(item.image, item.title, Modifier.fillMaxSize(), contentScale = ContentScale.Crop); Box(Modifier.fillMaxSize().background(Brush.verticalGradient(listOf(Color.Transparent, Color(0xEE0D0D0D))))); Surface(Modifier.align(Alignment.Center), color = Color.Transparent, shape = CircleShape, onClick = {}) { Icon(Icons.Default.PlayArrow, null, tint = Color.White, modifier = Modifier.size(32.dp).border(1.dp, Color.White, CircleShape).padding(9.dp)) }; Icon(Icons.Default.MoreVert, null, tint = Color.White, modifier = Modifier.align(Alignment.TopEnd).padding(11.dp).size(16.dp)); Column(Modifier.align(Alignment.BottomStart).padding(15.dp)) { Text(item.title, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 12.sp, maxLines = 1, overflow = TextOverflow.Ellipsis); Text(item.episode, color = Color.White, fontSize = 10.sp, modifier = Modifier.padding(top = 3.dp)); Box(Modifier.padding(top = 15.dp).fillMaxWidth().height(4.dp).clip(RoundedCornerShape(2.dp)).background(Color(0xFF555555))) { Box(Modifier.fillMaxWidth(item.progress).fillMaxSize().background(Red)) } } } } } }

@Composable private fun MovieRow(items: List<Movie>) { LazyRow(contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 12.dp), horizontalArrangement = Arrangement.spacedBy(16.dp)) { items(items, key = { it.title }) { item -> Column(Modifier.width(110.dp)) { AsyncImage(item.image, item.title, Modifier.fillMaxWidth().height(165.dp).clip(RoundedCornerShape(11.dp)), contentScale = ContentScale.Crop); Text(item.title, color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.SemiBold, maxLines = 1, overflow = TextOverflow.Ellipsis, modifier = Modifier.padding(top = 8.dp)); Text(item.duration, color = Muted, fontSize = 12.sp, modifier = Modifier.padding(top = 4.dp)) } } } }
