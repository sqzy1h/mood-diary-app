import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  Alert 
} from 'react-native';

export default function App() {
  // 状态
  const [diaryText, setDiaryText] = useState('');
  const [selectedMood, setSelectedMood] = useState('😊');
  const [diaryHistory, setDiaryHistory] = useState([]);
  
  // 心情选项
  const moods = ['😊', '😢', '😐', '😡', '🎉', '😴'];
  
  // 清空函数
  const handleClear = () => {
    setDiaryText('');
  };
  
  // 保存函数
  const handleSave = () => {
    const trimmedText = diaryText.trim();
    
    if (trimmedText === '') {
      Alert.alert('提示', '请先写点东西');
      return;
    }
    
    const newEntry = {
      id: Date.now(), // 使用时间戳作为唯一ID
      mood: selectedMood,
      text: trimmedText,
      date: new Date().toLocaleString('zh-CN'),
      timestamp: Date.now() // 添加时间戳用于排序
    };
    
    // 添加到历史记录
    setDiaryHistory([newEntry, ...diaryHistory]);
    
    Alert.alert('保存成功', `心情: ${selectedMood}\n已添加到历史记录`);
    setDiaryText(''); // 保存后清空
  };
  
  // 删除历史记录 - 修复版
  const handleDelete = (id) => {
    console.log('尝试删除ID:', id); // 调试信息
    
    Alert.alert(
      '删除确认',
      '确定要删除这条记录吗？',
      [
        { 
          text: '取消', 
          style: 'cancel',
          onPress: () => console.log('取消删除')
        },
        { 
          text: '删除', 
          style: 'destructive',
          onPress: () => {
            // 过滤出不等于id的记录
            const updatedHistory = diaryHistory.filter(item => {
              console.log('检查:', item.id, '===', id, '?', item.id !== id);
              return item.id !== id;
            });
            
            console.log('原始记录数:', diaryHistory.length);
            console.log('删除后记录数:', updatedHistory.length);
            
            // 更新状态
            setDiaryHistory(updatedHistory);
            Alert.alert('已删除', '记录已删除');
          }
        }
      ],
      { cancelable: true }
    );
  };
  
  return (
    <ScrollView style={styles.container}>
      {/* 标题 */}
      <View style={styles.header}>
        <Text style={styles.title}>📒 心情日记</Text>
        <Text style={styles.subtitle}>删除功能测试版</Text>
      </View>
      
      {/* 心情选择 */}
      <Text style={styles.sectionTitle}>选择心情</Text>
      <View style={styles.moodRow}>
        {moods.map((mood) => (
          <TouchableOpacity
            key={mood}
            style={[
              styles.moodButton,
              selectedMood === mood && { backgroundColor: '#E3F2FD' }
            ]}
            onPress={() => setSelectedMood(mood)}
          >
            <Text style={styles.emoji}>{mood}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* 当前心情 */}
      <View style={styles.currentMood}>
        <Text style={styles.currentMoodText}>
          当前心情: {selectedMood}
        </Text>
      </View>
      
      {/* 输入框 */}
      <Text style={styles.sectionTitle}>写日记</Text>
      <TextInput
        style={styles.input}
        placeholder="写下今天的心情..."
        value={diaryText}
        onChangeText={setDiaryText}
        multiline
      />
      
      {/* 字数统计 */}
      <View style={styles.charCount}>
        <Text style={styles.charCountText}>
          字数: {diaryText.length}
        </Text>
      </View>
      
      {/* 按钮区域 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={handleClear}
        >
          <Text style={styles.buttonText}>
            🗑️ 清空
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>
            💾 保存
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* 历史记录 - 确保onLongPress正确绑定 */}
      {diaryHistory.length > 0 && (
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>
            历史记录 ({diaryHistory.length}条) - 长按删除
          </Text>
          
          {diaryHistory.map((entry) => (
            <TouchableOpacity
              key={entry.id}
              style={styles.historyItem}
              onPress={() => console.log('点击记录:', entry.id)}
              onLongPress={() => {
                console.log('长按记录:', entry.id);
                handleDelete(entry.id);
              }}
              delayLongPress={500} // 长按延迟500毫秒
            >
              <View style={styles.historyHeader}>
                <Text style={styles.historyMood}>{entry.mood}</Text>
                <Text style={styles.historyDate}>{entry.date}</Text>
              </View>
              <Text style={styles.historyText}>{entry.text}</Text>
              
              {/* 显示ID用于调试 */}
              <Text style={styles.debugText}>
                ID: {entry.id} (长按2秒删除)
              </Text>
              
              <Text style={styles.deleteHint}>
                👆 长按2秒可删除此记录
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      {/* 调试信息 */}
      <View style={styles.debugSection}>
        <Text style={styles.debugTitle}>调试信息</Text>
        <Text style={styles.debugText}>记录总数: {diaryHistory.length}</Text>
        <Text style={styles.debugText}>当前文本: "{diaryText}"</Text>
        <Text style={styles.debugText}>选中心情: {selectedMood}</Text>
      </View>
    </ScrollView>
  );
}

// 样式
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  moodButton: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 50,
  },
  emoji: {
    fontSize: 28,
  },
  currentMood: {
    alignItems: 'center',
    marginBottom: 20,
  },
  currentMoodText: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    minHeight: 120,
    fontSize: 16,
    marginBottom: 10,
  },
  charCount: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  charCountText: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  clearButton: {
    backgroundColor: '#ff6b6b',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  historySection: {
    marginTop: 10,
  },
  historyItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  historyMood: {
    fontSize: 24,
  },
  historyDate: {
    fontSize: 12,
    color: '#666',
  },
  historyText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 5,
  },
  deleteHint: {
    fontSize: 12,
    color: '#ff6b6b',
    fontStyle: 'italic',
    marginTop: 5,
  },
  debugSection: {
    backgroundColor: '#FFF3CD',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#FFEEBA',
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 10,
  },
  debugText: {
    fontSize: 12,
    color: '#856404',
    marginBottom: 3,
  },
});