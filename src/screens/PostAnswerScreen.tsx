import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { RootState } from '../store';
import { CustomButton } from '../components';
import { postAnswer } from '../services/answer';
import { red } from 'react-native-reanimated/lib/typescript/Colors';

export const PostAnswerScreen = () => {
  // const dispatch = useDispatch<AppDispatch>();
  const [answer, setAnswer] = useState('');
  const selectedQuestion = useSelector((state: RootState) =>
    state.questions.pendingQuestions.find((q) => q.id === state.questions.selectedQuestionId)
  );

  console.log('selected question: ', selectedQuestion);
  const handleSubmit = async () => {
    try {
      await postAnswer(selectedQuestion?.id || '', { content: answer });
      Alert.alert('Success', 'Your answer was posted successfully!');
      setAnswer('');
    } catch (error) {
      Alert.alert('Error', 'Failed to post your answer');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionTitle}>{selectedQuestion?.title}</Text>
      <Text style={styles.questionContent}>{selectedQuestion?.content}</Text>
      <TextInput
        style={styles.input}
        placeholder="Write your answer..."
        value={answer}
        onChangeText={setAnswer}
        maxLength={200} // Enforce text limit
      />
      <CustomButton
        title="Post Answer"
        onPress={handleSubmit}
        disabled={!answer.trim()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  questionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  questionContent: { fontSize: 14, color: '#555', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
});
