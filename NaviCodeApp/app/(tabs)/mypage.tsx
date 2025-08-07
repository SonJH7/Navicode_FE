import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '@emotion/react';
import type { AppTheme } from '@/theme';
import { BottomBar } from '@/components/BottomBar/BottomBar';

export default function MyPageScreen() {
  const theme = useTheme() as AppTheme;
  const styles = useStyles(theme);

  const [saveRecentSearch, setSaveRecentSearch] = useState(true);
  const [allNotifications, setAllNotifications] = useState(true);
  const [favChangeNotification, setFavChangeNotification] = useState(true);
  const [updateNotification, setUpdateNotification] = useState(true);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>계정 관리</Text>
          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>내 정보 수정</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.iconLight} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>비밀번호 변경</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.iconLight} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>소셜 계정 연동</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.iconLight} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <Text style={[styles.itemText, styles.dangerText]}>회원 탈퇴</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>검색 환경</Text>
          <View style={styles.item}>
            <Text style={styles.itemText}>최근 검색어 저장</Text>
            <Switch value={saveRecentSearch} onValueChange={setSaveRecentSearch} />
          </View>
          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>검색 결과 정렬 기본값</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.iconLight} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>검색 히스토리 삭제</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>즐겨찾기·히스토리</Text>
          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>즐겨찾기 목록</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.iconLight} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>최근 본 항목</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.iconLight} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>전체 삭제</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>알림 설정</Text>
          <View style={styles.item}>
            <Text style={styles.itemText}>전체 알림</Text>
            <Switch value={allNotifications} onValueChange={setAllNotifications} />
          </View>
          <View style={styles.item}>
            <Text style={styles.itemText}>즐겨찾기 변경 알림</Text>
            <Switch value={favChangeNotification} onValueChange={setFavChangeNotification} />
          </View>
          <View style={styles.item}>
            <Text style={styles.itemText}>업데이트 소식</Text>
            <Switch value={updateNotification} onValueChange={setUpdateNotification} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>기타</Text>
          <View style={styles.item}>
            <Text style={styles.itemText}>버전 정보</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.itemText}>오픈소스 라이선스</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.itemText}>문의하기/피드백</Text>
          </View>
        </View>
       </ScrollView>
      <BottomBar selected="mypage" />
    </View>
  );
}

function useStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.backgroundDefault,
    },
    content: {
      padding: theme.spacing.spacing4,
      paddingBottom: theme.spacing.spacingCLB,
    },
    section: {
      marginBottom: theme.spacing.spacing6,
    },
    sectionTitle: {
      ...theme.typography.subtitle2Bold,
      color: theme.colors.textDefault,
      marginBottom: theme.spacing.spacing2,
    },
    item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.spacing3,
      borderBottomWidth: 1,
      borderColor: theme.colors.borderDefault,
    },
    itemText: {
      ...theme.typography.body2Regular,
      color: theme.colors.textDefault,
    },
    dangerText: {
      color: theme.colors.critical,
    },
  });
}
