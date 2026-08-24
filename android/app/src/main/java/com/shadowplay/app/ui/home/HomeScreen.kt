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
import androidx.compose.foundation.lazy.itemsIndexed
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
private val Card = Color(0xFF1F1F1F)

@Composable
fun HomeRoute(vm: HomeViewModel = viewModel()) {
    val state by vm.uiState.collectAsStateWithLifecycle()
    HomeScreen(state, vm::selectCategory, vm::selectNav)
}

@Composable
private fun HomeScreen(state: HomeUiState, onCategory: (String) -> Unit, onNav: (Int) -> Unit) {
    ScaffoldWithNav(state.selectedNav, onNav) {
        LazyColumn(Modifier.fillMaxSize().background(Color(0xFF0D0D0D)), contentPadding = androidx.compose.foundation.layout.PaddingValues(bottom = 28.dp)) {
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
    androidx.compose.material3.Scaffold(containerColor = Color(0xFF0D0D0D), bottomBar = {
        Row(Modifier.fillMaxWidth().background(Color(0xFF151515)).navigationBarsPadding().height(72.dp), horizontalArrangement = Arrangement.SpaceEvenly, verticalAlignment = Alignment.CenterVertically) {
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
    Column(Modifier.padding(top = 24.dp, bottom = 14.dp)) {
        Row(Modifier.fillMaxWidth().padding(horizontal = 20.dp), verticalAlignment = Alignment.CenterVertically) {
            Box(Modifier.size(31.dp).clip(RoundedCornerShape(9.dp)).background(Red), contentAlignment = Alignment.Center) { Icon(Icons.Default.PlayArrow, null, tint = Color.White, modifier = Modifier.size(20.dp)) }
            Spacer(Modifier.width(9.dp)); Text("SHADOW", color = Color.White, fontSize = 20.sp, fontWeight = FontWeight.ExtraBold, letterSpacing = 1.5.sp); Text(" PLAY", color = Red, fontSize = 20.sp, fontWeight = FontWeight.ExtraBold, letterSpacing = 1.5.sp)
            Spacer(Modifier.weight(1f)); IconButton(onClick = {}) { Icon(Icons.Default.Search, "Search", tint = Color.White) }
        }
        Row(Modifier.padding(start = 20.dp, top = 19.dp).horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(9.dp)) {
            listOf("Home", "Movies", "Anime", "TV Shows").forEach { label -> Surface(onClick = { onCategory(label) }, color = if (selected == label) Red else Card, shape = RoundedCornerShape(20.dp)) { Text(label, color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.SemiBold, modifier = Modifier.padding(horizontal = 17.dp, vertical = 9.dp)) } }
        }
    }
}

@Composable private fun HeroBanner() {
    Box(Modifier.fillMaxWidth().height(312.dp).padding(horizontal = 20.dp).clip(RoundedCornerShape(18.dp))) {
        AsyncImage("https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200", "Solo Leveling hero", Modifier.fillMaxSize(), contentScale = ContentScale.Crop)
        Box(Modifier.fillMaxSize().background(Brush.verticalGradient(listOf(Color.Transparent, Color(0xE60D0D0D)))))
        Column(Modifier.align(Alignment.BottomStart).padding(20.dp)) {
            Text("TRENDING NOW", color = Red, fontSize = 11.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.5.sp)
            Spacer(Modifier.height(7.dp)); Text("SOLO LEVELING\nSEASON 2", color = Color.White, fontSize = 25.sp, lineHeight = 28.sp, fontWeight = FontWeight.ExtraBold)
            Spacer(Modifier.height(7.dp)); Text("Sung Jinwoo rises from the shadows to\nface a new level of danger.", color = Color(0xFFD0D0D0), fontSize = 11.sp, lineHeight = 16.sp)
            Spacer(Modifier.height(14.dp)); Surface(onClick = {}, color = Red, shape = RoundedCornerShape(7.dp)) { Row(Modifier.padding(horizontal = 14.dp, vertical = 10.dp), verticalAlignment = Alignment.CenterVertically) { Icon(Icons.Default.PlayArrow, null, tint = Color.White, modifier = Modifier.size(17.dp)); Spacer(Modifier.width(5.dp)); Text("Watch Now", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 12.sp) } }
        }
        Row(Modifier.align(Alignment.BottomEnd).padding(20.dp), horizontalArrangement = Arrangement.spacedBy(5.dp)) { repeat(4) { Box(Modifier.size(if (it == 0) 17.dp else 5.dp, 5.dp).clip(CircleShape).background(if (it == 0) Red else Color(0xFF777777))) } }
    }
}

@Composable private fun SectionHeader(title: String, action: String?) { Row(Modifier.fillMaxWidth().padding(start = 20.dp, end = 20.dp, top = 25.dp, bottom = 13.dp), verticalAlignment = Alignment.CenterVertically) { Text(title, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 18.sp); Spacer(Modifier.weight(1f)); action?.let { Text(it, color = Red, fontSize = 12.sp, fontWeight = FontWeight.SemiBold) } } }

@Composable private fun CategoryGrid() { val categories = listOf("Anime" to Icons.Default.Star, "Bollywood" to Icons.Default.Tv, "Hollywood" to Icons.Default.Star, "TV Shows" to Icons.Default.Tv); Column(Modifier.padding(horizontal = 20.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) { categories.chunked(2).forEach { row -> Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) { row.forEach { (name, icon) -> Surface(Modifier.weight(1f), color = Card, shape = RoundedCornerShape(12.dp), onClick = {}) { Row(Modifier.padding(13.dp), verticalAlignment = Alignment.CenterVertically) { Box(Modifier.size(33.dp).clip(CircleShape).background(Color(0x22E50914)), contentAlignment = Alignment.Center) { Icon(icon, null, tint = Red, modifier = Modifier.size(18.dp)) }; Spacer(Modifier.width(10.dp)); Text(name, color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.SemiBold) } } } } } }

@Composable private fun ContinueRow(items: List<ContinueItem>) { LazyRow(contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 20.dp), horizontalArrangement = Arrangement.spacedBy(12.dp)) { items(items, key = { it.title }) { item -> Column(Modifier.width(188.dp)) { Box(Modifier.fillMaxWidth().height(108.dp).clip(RoundedCornerShape(12.dp))) { AsyncImage(item.image, item.title, Modifier.fillMaxSize(), contentScale = ContentScale.Crop); Box(Modifier.fillMaxSize().background(Color(0x66000000))); Surface(Modifier.align(Alignment.Center), color = Color(0xCCFFFFFF), shape = CircleShape, onClick = {}) { Icon(Icons.Default.PlayArrow, null, tint = Color.Black, modifier = Modifier.padding(8.dp).size(19.dp)) }; Icon(Icons.Default.MoreVert, null, tint = Color.White, modifier = Modifier.align(Alignment.TopEnd).padding(8.dp)) ; Box(Modifier.align(Alignment.BottomStart).fillMaxWidth(item.progress).height(3.dp).background(Red)) }; Spacer(Modifier.height(8.dp)); Text(item.title, color = Color.White, fontWeight = FontWeight.SemiBold, fontSize = 13.sp, maxLines = 1, overflow = TextOverflow.Ellipsis); Text(item.episode, color = Muted, fontSize = 11.sp, modifier = Modifier.padding(top = 3.dp)) } } } }

@Composable private fun MovieRow(items: List<Movie>) { LazyRow(contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 20.dp), horizontalArrangement = Arrangement.spacedBy(12.dp)) { items(items, key = { it.title }) { item -> Column(Modifier.width(124.dp)) { AsyncImage(item.image, item.title, Modifier.fillMaxWidth().height(172.dp).clip(RoundedCornerShape(11.dp)), contentScale = ContentScale.Crop); Text(item.title, color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.SemiBold, maxLines = 1, overflow = TextOverflow.Ellipsis, modifier = Modifier.padding(top = 8.dp)); Text(item.duration, color = Muted, fontSize = 11.sp, modifier = Modifier.padding(top = 3.dp)) } } } }
