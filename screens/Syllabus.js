import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const syllabusData = [
  { unit: "Unit 1", topics: ["1. Introduction", "2. Basic vocabulary"] },
  { unit: "Unit 2", topics: ["1. Grammar basics", "2. Common phrases"] },
  { unit: "Unit 3", topics: ["1. Verbs", "2. Sentence structure"] },
  { unit: "Unit 4", topics: ["1. Listening practice", "2. Speaking drills"] },
  { unit: "Unit 5", topics: ["1. Reading comprehension", "2. Writing practice"] },
  { unit: "Unit 6", topics: ["1. Review", "2. Final quiz"] },
];

export default function Syllabus({ navigation }) {
  const [expandedUnit, setExpandedUnit] = useState(null);

  const toggleUnit = (index) => {
    setExpandedUnit(expandedUnit === index ? null : index);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("../assets/Synlogo.png")}
          style={styles.logo}
        />
        <Text style={styles.headerText}>Syllabus</Text>
      </View>

      {/* Syllabus List */}
      <FlatList
        data={syllabusData}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item, index }) => (
          <View style={styles.unitContainer}>
            <TouchableOpacity
              style={styles.unitHeader}
              onPress={() => toggleUnit(index)}
            >
              <Ionicons
                name={expandedUnit === index ? "chevron-up" : "chevron-down"}
                size={20}
                color="#000"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.unitTitle}>{item.unit}</Text>
            </TouchableOpacity>
            {expandedUnit === index && (
              <View style={styles.topicList}>
                {item.topics.map((topic, i) => (
                  <Text key={i} style={styles.topicText}>{topic}</Text>
                ))}
              </View>
            )}
          </View>
        )}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate("Syllabus")} style={styles.footerIcon1}>
          <Ionicons name="calendar" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Progress")} style={styles.footerIcon2}>
          <Ionicons name="stats-chart" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={styles.footerLogoButton}
        >
          <Image
            source={require("../assets/Synlogo.png")}
            style={styles.footerLogo}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("ChatBot")} style={styles.footerIcon3}>
          <Ionicons name="chatbubble-ellipses" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("User")} style={styles.footerIcon4}>
          <Ionicons name="person-circle" size={26} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f3ee",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C5E86",
    padding: 15,
    paddingTop: 50,
    justifyContent: "center",
    gap: 10,
    width: "100%",
    marginBottom: 10,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
    resizeMode: "contain",
    borderRadius: 25,
    backgroundColor: "#EFF1EC",
  },
  headerText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  unitContainer: {
    backgroundColor: "#d9d9d9",
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
  unitHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  unitTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  topicList: {
    marginTop: 10,
    backgroundColor: "#4b9eac",
    padding: 10,
    borderRadius: 8,
  },
  topicText: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 5,
  },
  footer: {
    height: 50,
    backgroundColor: "#BDE4E6",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  footerIcon1: {
    position: "absolute",
    left: 20,
    bottom: 10,
  },
  footerIcon2: {
    position: "absolute",
    left: 100,
    bottom: 10,
  },
  footerIcon3: {
    position: "absolute",
    right: 100,
    bottom: 10,
  },
  footerIcon4: {
    position: "absolute",
    right: 20,
    bottom: 10,
  },
  footerLogo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#BDE4E6",
  },
  footerLogoButton: {
    position: "absolute",
    top: -40,
    left: "50%",
    transform: [{ translateX: -40 }],
    backgroundColor: "#EFF1EC",
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#BDE4E6",
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
});

