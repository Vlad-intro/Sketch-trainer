
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

const UNSPLASH_KEY = "d9kFNZPh6ugjFPd3BwmgjM1Vh66CRGhR2vKwVUJfzuE";

const categories = [
  {key:"figures", icon:require('./assets/icons/category_figures.png')},
  {key:"animals", icon:require('./assets/icons/category_animals.png')},
  {key:"architecture", icon:require('./assets/icons/category_architecture.png')},
  {key:"objects", icon:require('./assets/icons/category_objects.png')},
  {key:"people", icon:require('./assets/icons/category_people.png')},
  {key:"random", icon:require('./assets/icons/category_random.png')}
];

const times = [
  {key:1, icon:require('./assets/icons/time_1.png')},
  {key:3, icon:require('./assets/icons/time_3.png')},
  {key:5, icon:require('./assets/icons/time_5.png')},
  {key:7, icon:require('./assets/icons/time_7.png')},
  {key:10, icon:require('./assets/icons/time_10.png')}
];

const difficulties = [
  {key:"easy", icon:require('./assets/icons/difficulty_easy.png')},
  {key:"medium", icon:require('./assets/icons/difficulty_medium.png')},
  {key:"hard", icon:require('./assets/icons/difficulty_hard.png')}
];

export default function App() {
  const [category, setCategory] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [time, setTime] = useState(null);
  const [url, setUrl] = useState(null);
  const [left, setLeft] = useState(0);
  const [started, setStarted] = useState(false);

  async function loadImage(cat) {
    const q = cat === "random" ? "sketch" : cat + "+sketch";
    const r = await fetch(
      `https://api.unsplash.com/photos/random?query=${q}&client_id=${UNSPLASH_KEY}`
    );
    const data = await r.json();
    setUrl(data.urls.regular);
  }

  function startSession() {
    if (!category || !difficulty || !time) {
      alert("Выберите все параметры!");
      return;
    }
    loadImage(category);
    setLeft(time * 60);
    setStarted(true);
  }

  function stopSession() {
    setStarted(false);
    setUrl(null);
    setCategory(null);
    setDifficulty(null);
    setTime(null);
  }

  useEffect(() => {
    if (!started) return;
    const t = setInterval(() => {
      setLeft(x => {
        if (x <= 1) {
          clearInterval(t);
          setStarted(false);
          return 0;
        }
        return x - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [started]);

  if (!started) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Sketch Trainer</Text>

        <Text style={styles.subtitle}>Категории</Text>
        <View style={styles.grid}>
          {categories.map(c => (
            <TouchableOpacity key={c.key} onPress={() => setCategory(c.key)}
              style={[styles.cell, category===c.key && styles.active]}>
              <Image source={c.icon} style={styles.icon}/>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.subtitle}>Сложность</Text>
        <View style={styles.row}>
          {difficulties.map(d => (
            <TouchableOpacity key={d.key} onPress={() => setDifficulty(d.key)}
              style={[styles.pick, difficulty===d.key && styles.active]}>
              <Image source={d.icon} style={styles.iconSmall}/>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.subtitle}>Таймер</Text>
        <View style={styles.row}>
          {times.map(t => (
            <TouchableOpacity key={t.key} onPress={() => setTime(t.key)}
              style={[styles.pick, time===t.key && styles.active]}>
              <Image source={t.icon} style={styles.iconSmall}/>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.startBtn} onPress={startSession}>
          <Image source={require('./assets/icons/btn_start.png')} style={styles.iconSmall}/>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Осталось: {left} сек</Text>

      {url ? <Image source={{ uri: url }} style={styles.img} /> : <Text>Загрузка...</Text>}

      <TouchableOpacity style={styles.btn} onPress={() => loadImage(category)}>
        <Image source={require('./assets/icons/btn_next.png')} style={styles.iconSmall}/>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={stopSession}>
        <Image source={require('./assets/icons/btn_menu.png')} style={styles.iconSmall}/>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,alignItems:'center',paddingTop:40},
  title:{fontSize:28,marginBottom:20},
  subtitle:{fontSize:20,marginTop:20},
  grid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'center'},
  cell:{width:100,height:100,backgroundColor:'#ddd',margin:5,borderRadius:14,alignItems:'center',justifyContent:'center'},
  active:{backgroundColor:'#aaa'},
  icon:{width:70,height:70,resizeMode:'contain'},
  iconSmall:{width:50,height:50,resizeMode:'contain'},
  row:{flexDirection:'row',marginTop:10},
  pick:{padding:10,backgroundColor:'#ddd',margin:5,borderRadius:10},
  startBtn:{marginTop:30,backgroundColor:'#000',padding:14,borderRadius:10},
  img:{width:320,height:420,resizeMode:'cover',borderRadius:14,marginBottom:20},
  btn:{backgroundColor:'#000',padding:14,borderRadius:10,marginVertical:5}
});
