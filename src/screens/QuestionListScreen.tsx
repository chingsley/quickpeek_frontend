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
    return <Text>Loading...</Text>;
  }

  return (
    <FlatList
      data={pendingQuestions}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => handleQuestionSelect(item.id)} style={styles.questionContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.content}>{item.content}</Text>
        </TouchableOpacity>
      )}
      style={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 10, },
  questionContainer: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  title: { fontWeight: 'bold', fontSize: 16 },
  content: { color: '#555' },
});
