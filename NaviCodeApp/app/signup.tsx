import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      await signUp(username, password, name);
      router.replace('/');
    } catch (e: any) {
      alert('회원가입 실패: ' + e.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.column}>
        <Text style={styles.title}>NaviCode</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="ID"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>SignUp</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.linkText}>로그인으로 돌아가기</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  column: { alignItems: 'center', paddingTop: 200 },
  title: { fontSize: 50, marginBottom: 50 },
  input: {
    width: '80%',
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  button: {
    width: '80%',
    backgroundColor: '#D9D9D9',
    padding: 12,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: { fontSize: 18, color: '#000' },
  linkText: { fontSize: 16, color: '#9C9898', textDecorationLine: 'underline' },
});