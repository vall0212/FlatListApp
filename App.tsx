import { useState, useEffect, useCallback } from "react";
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import axios from "axios";
import { SafeAreaProvider } from "react-native-safe-area-context";
import type {ListRenderItem} from "react-native";

type Todo = {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

const API_URL = 'https://jsonplaceholder.typicode.com/todos';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get<Todo[]>(API_URL);
        setTodos(response.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
        setError('Something went wrong when trying to fetch the data from the API!');
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  });

  // Item renderer for FlatList.
  const renderItem: ListRenderItem<Todo> = useCallback(({ item }) => (
    <View style={styles.commentItem}>
      <Text style={styles.id}>ID: {item.id}</Text>
      <Text style={styles.title}>Title: {item.title}</Text>
      <Text style={styles.status}>Status: {item.completed ? 'Yes' : 'No'}</Text>
    </View>
  ), []);

  // Key extractor for FlatList.
  const keyExtractor = useCallback((item: Todo) => item.id.toString(), []);

  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView>
        {loading ? (
          <ActivityIndicator size="large" color="grey" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <FlatList
            data={todos}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.flatListContentContainer}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  flatListContentContainer: {
    paddingVertical: 16,
  },
  commentItem: {
    marginBottom: 16,
  },
  id: {
    fontWeight: "bold",
  },
  title: {
    color: "gray",
  },
  status: {
    marginTop: 4,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});
