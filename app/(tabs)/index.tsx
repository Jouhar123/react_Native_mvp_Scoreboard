import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from "react-native";

import players from "../../assets/players.json";
import events from "../../assets/events.json";

export default function HomeScreen() {
  const systemTheme = useColorScheme();
  const [currentTheme, setCurrentTheme] = useState(systemTheme || "light");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [showTopPlayers, setShowTopPlayers] = useState(false);

  // Leaderboard rules
  const MVP_POINTS = {
    TAKE_WICKET: 20,
    "50_RUNS_MILESTONE": 15,
    HIT_SIX: 2,
    HIT_FOUR: 1,
  };

  useEffect(() => {
    generateLeaderboard();
  }, []);

  const generateLeaderboard = () => {
    const scoreMap = {};

    // initialize players
    players.forEach(player => {
      scoreMap[player.id] = { ...player, score: 0 };
    });

    // add event points
    events.forEach(event => {
      const points = MVP_POINTS[event.action] || 0;
      scoreMap[event.playerId].score += points;
    });

    const sortedPlayers = Object.values(scoreMap).sort(
      (a, b) => b.score - a.score
    );

    setLeaderboardData(sortedPlayers);
  };

  const filteredPlayers = showTopPlayers
    ? leaderboardData.filter(player => player.score >= 20)
    : leaderboardData;

  const isDarkMode = currentTheme === "dark";

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.headerTitle, isDarkMode && styles.textDark]}>
        🏆 MVP Leaderboard
      </Text>

      {/* dark and light toggle */}
      <TouchableOpacity
        style={[styles.themeToggleButton, isDarkMode && styles.buttonDark]}
        onPress={() => setCurrentTheme(isDarkMode ? "light" : "dark")}
      >
        <Text style={[styles.buttonText, isDarkMode && styles.textDark]}>
          {isDarkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </Text>
      </TouchableOpacity>

      {/* player list toggle  */}
      <TouchableOpacity
        style={[styles.filterButton, isDarkMode && styles.buttonDark]}
        onPress={() => setShowTopPlayers(!showTopPlayers)}
      >
        <Text style={[styles.buttonText, isDarkMode && styles.textDark]}>
          {showTopPlayers ? "Show All Players" : "Show Top Performers"}
        </Text>
      </TouchableOpacity>

      {/* leaderboard */}
      <FlatList
        data={filteredPlayers}
        keyExtractor={player => player.id.toString()}
        renderItem={({ item, index }) => (
          <View style={[styles.playerCard, isDarkMode && styles.cardDark]}>
            <Text style={[styles.playerRank, isDarkMode && styles.textDark]}>
              #{index + 1}
            </Text>

            <View style={{ flex: 1 }}>
              <Text style={[styles.playerName, isDarkMode && styles.textDark]}>
                {item.name}
              </Text>
            </View>

            {/* scorebadge */}
            <View
              style={[styles.scoreBadge, isDarkMode && styles.scoreBadgeDark]}
            >
              <Text style={styles.scoreBadgeText}>⭐ {item.score}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  darkContainer: {
    backgroundColor: "#1E1E1E",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#000",
  },
  textDark: {
    color: "#FFF",
  },
  themeToggleButton: {
    backgroundColor: "#FFD43B",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  filterButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonDark: {
    backgroundColor: "#333",
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#FFF",
  },
  playerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  cardDark: {
    backgroundColor: "#2A2A2A",
  },
  playerRank: {
    width: 40,
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  playerName: {
    fontSize: 18,
    fontWeight: "600",
  },
  scoreBadge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  scoreBadgeDark: {
    backgroundColor: "#444",
  },
  scoreBadgeText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});
