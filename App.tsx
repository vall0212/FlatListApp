import { useState, useEffect } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import axios from "axios";
import { SafeAreaProvider } from "react-native-safe-area-context";
import type {ListRenderItem} from "react-native";

type Comment = {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export default function App() {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    axios
      .get<Comment[]>("https://jsonplaceholder.typicode.com/comments")
      .then((response) => {
        setComments(response.data);
      })
      .catch((e) => {
        console.error("Error fetching data: ", e);
      });
  });

  // Item renderer for FlatList
  const renderItem: ListRenderItem<Comment> = ({ item }) => (
    <View style={styles.commentItem}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.email}>{item.email}</Text>
      <Text style={styles.body}>{item.body}</Text>
    </View>
  );

  // Key extractor for FlatList
  const keyExtractor = (item: Comment) => item.id.toString();

  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView>
        <FlatList
          data={comments}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  commentItem: {
    marginBottom: 16,
  },
  name: {
    fontWeight: "bold",
  },
  email: {
    color: "gray",
  },
  body: {
    marginTop: 4,
  },
});
