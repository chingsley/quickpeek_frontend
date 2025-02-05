import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { FlatList, Text, TouchableOpacity, StyleSheet, View, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchPendingQuestions, selectQuestion } from '../store/slices/questionSlice';

export const QuestionListScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const { pendingQuestions, isLoading } = useSelector((state: RootState) => state.questions);

  useEffect(() => {
    dispatch(fetchPendingQuestions());
  }, [dispatch]);

  const handleQuestionSelect = (questionId: string) => {
    dispatch(selectQuestion(questionId));
    navigation.navigate('PostAnswer' as never);
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!pendingQuestions || pendingQuestions.length === 0) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={pendingQuestions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleQuestionSelect(item.id)}
            style={styles.questionContainer}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.content}>{item.content}</Text>
          </TouchableOpacity>
        )}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50, // Adjust this value as needed to clear your hamburger menu
    borderWidth: 1, // Red border for development debugging
    borderColor: 'red',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1, // Red border for development debugging
    borderColor: 'red',
  },
  loadingText: {
    marginTop: 50,
    textAlign: 'center',
    borderWidth: 1, // Red border for development debugging
    borderColor: 'red',
  },
  list: {
    padding: 10,
    borderWidth: 1, // Red border for development debugging
    borderColor: 'red',
  },
  questionContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderWidth: 1, // Red border for development debugging
    borderColor: 'red',
    marginBottom: 10, // Optional: adds space between items for clarity
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  content: {
    color: '#555',
  },
});

export default QuestionListScreen;
