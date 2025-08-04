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

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signIn(username, password);
      router.replace('/');
    } catch (e: any) {
      alert('로그인 실패: ' + e.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.column}>
        {/* 개발자 전용 임시 홈 이동 */}
        <TouchableOpacity onPress={() => router.replace('/')}
          accessibilityLabel="개발자 홈 바로가기">
          <Text style={styles.title}>NaviCode</Text>
        </TouchableOpacity>        
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
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.navigate('signup')}>
          <Text style={styles.linkText}>회원가입</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
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