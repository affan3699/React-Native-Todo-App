import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
  Keyboard,
  TextInput,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Local Sorage
import Icon from 'react-native-vector-icons/MaterialIcons'; // Vectore Icon Library
import Dialog from 'react-native-dialog'; // Dialog Box
import DialogInput from 'react-native-dialog/lib/Input'; // Dialog Box Input
import filter from 'lodash.filter'; // Flatlist Searching

const App = () => {
  // This is to manage tasks State
  const [tasks, setTasks] = useState([
    {id: 1, title1: 'First TODO', desc: 'Hello', completed: false},
  ]);

  const [title, setTitle] = useState(''); // This is to manage title State
  const [description, setDescription] = useState(''); // This is to manage Description State
  const [visible, setVisible] = useState(false); // This is to manage Dialog Box State
  const [search, setSearch] = useState(''); // This is to manage Search TextInput State
  const [fullData, setFullData] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    storeData(tasks);
  }, [tasks]);

  // Adding a task
  const addTask = () => {
    if (title == '' || description == '') {
      Alert.alert('Error', 'Cannot Add Empty Task');
    } else {
      let newTask = {
        id: Math.random(),
        title1: title,
        desc: description,
        completed: false,
      };

      setTasks([...tasks, newTask]);
      setTitle('');
      setDescription('');
      handleCancel(); // for dialog box to disappear

      Keyboard.dismiss();
    }
  };

  // Deleting a task
  const deleteTodo = taskID => {
    const newTaskList = tasks.filter(item => item.id != taskID);
    setTasks(newTaskList);
  };

  // Alert Box for confirmation of task completed
  const taskCompleted = taskID => {
    Alert.alert('Mark Completed?', '', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => tempFunc(taskID)},
    ]);
  };

  const tempFunc = taskID => {
    const tempTasks = tasks.map(item => {
      if (item.id == taskID) {
        return {...item, completed: true};
      }
      return item;
    });

    setTasks(tempTasks);
  };

  // Saving Data into local storage
  const storeData = async todos => {
    try {
      const stringifyTodos = JSON.stringify(todos);
      await AsyncStorage.setItem('tasks', stringifyTodos);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetching Data from local storage
  const getData = async () => {
    try {
      const tasks = await AsyncStorage.getItem('tasks');
      if (tasks != null) {
        setTasks(JSON.parse(tasks));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Create Dialog function that will
  // Open and close Dialog upon button clicks.
  const showDialog = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const searchData = text => {
    setFullData(tasks);
    const formattedQuery = text.toLowerCase();
    const filteredData = filter(fullData, task => {
      return contains(task.title1.toLowerCase(), formattedQuery);
    });
    setFilteredTasks(filteredData);
    setSearch(text);
  };

  const contains = (task, query) => {
    if (task.includes(query)) {
      return true;
    }

    return false;
  };

  const Container = ({todo}) => {
    return (
      <TouchableOpacity onPress={() => taskCompleted(todo.id)}>
        <View style={styles.container}>
          <View style={{flex: 1}}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: 'bold',
                color: 'black',
                textDecorationLine: todo?.completed ? 'line-through' : 'none',
              }}>
              {todo.title1}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: 'black',
                textDecorationLine: todo?.completed ? 'line-through' : 'none',
              }}>
              {todo.desc}
            </Text>
          </View>
          <TouchableOpacity onPress={() => deleteTodo(todo.id)}>
            <Icon name="delete-forever" size={25} color="red" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.mainView}>
      <View style={styles.appBar}>
        <Text style={styles.heading}>TODO APP</Text>
      </View>
      <View style={styles.searchView}>
        <TextInput
          style={styles.textInput}
          placeholder="Search"
          onChangeText={value => searchData(value)}
          value={search}
          autoFocus={false}
        />
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={search ? filteredTasks : tasks}
        contentContainerStyle={{padding: 15}}
        renderItem={({item}) => <Container todo={item} />}
      />
      <View>
        <Dialog.Container visible={visible}>
          <Dialog.Title>Add Task</Dialog.Title>
          <DialogInput
            placeholder="Enter Title"
            onChangeText={value => setTitle(value)}
            value={title}
          />
          <DialogInput
            placeholder="Enter Description"
            value={description}
            onChangeText={value => setDescription(value)}
            multiline={true}
            numberOfLines={2}
          />
          <Dialog.Button label="Cancel" onPress={handleCancel} />
          <Dialog.Button label="Add" onPress={addTask} />
        </Dialog.Container>
      </View>
      <View style={styles.addButtonView}>
        <TouchableOpacity onPress={showDialog}>
          <Icon name="add" color="white" size={27} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },

  appBar: {
    margin: '5%',
    alignItems: 'center',
  },

  heading: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
  },

  addButtonView: {
    height: 48,
    width: 48,
    backgroundColor: 'black',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '81%',
    marginBottom: '4%',
  },

  container: {
    padding: '5%',
    marginVertical: 9,
    backgroundColor: 'aliceblue',
    flexDirection: 'row',
  },

  textInput: {
    width: '88%',
    borderRadius: 5,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
  },

  searchView: {
    alignItems: 'center',
  },
});

export default App;
