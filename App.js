import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, FlatList, SectionList, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AntDesign } from '@expo/vector-icons';

function HomeScreen({ navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const url = 'https://swapi.dev/api/films';
  
  const getMovies = async () => {
    try {
     const response = await fetch(url);
     const json = await response.json();
     setData(json.results);

     
   } catch (error) {
     console.error(error);
   } finally {
     setLoading(false);
   }
 }

 useEffect(() => {
  getMovies();
 }, []);

  const itemSeparator = () => <View 
  style={{height: 2,
    backgroundColor: "rgba(0,0,0,0.5)",
    marginLeft: 10,
    marginRight: 10}} />

  return (
    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'stretch', justifyContent: 'center' }}>
      {isLoading ? <ActivityIndicator/> : (
        <FlatList
          data={data}
          keyExtractor={({ id }, index) => id}
          renderItem={({ item }) => (
            <TouchableOpacity style ={styles.button}
            onPress={() => {
              navigation.navigate("Home_to_Details",{movie: {
                title:        item.title,
                release:      item.release_date,
                director:  item.director,
                producer: item.producer,
                opening_crawl: item.opening_crawl,
                characters: item.characters
              }} )}}>
              <Text style={styles.title}>
                {item.title}
                <View style={{ position: 'absolute', right: 0 }}><AntDesign name="right" size={24} color="black"  /></View>
              </Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={itemSeparator}
        />
      )}
    </View>
  );
}

function DetailsScreen({ route, navigation }) {

  const [isLoading, setLoading] = useState(true);
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [name3, setName3] = useState('');

  console.log(route);
  const movie = route.params.movie;
  const characterApis = movie.characters;
  let uri1 = characterApis[0];
  let uri2 = characterApis[1];
  let uri3 = characterApis[2];

  const getName1 = async () => {
    try {
     const response = await fetch(uri1);
     const json = await response.json();
     setName1(json.name);
   } catch (error) {
     console.error(error);
   } finally {
     setLoading(false);
   }
  }

  const getName2 = async () => {
    try {
     const response = await fetch(uri2);
     const json = await response.json();
     setName2(json.name);
   } catch (error) {
     console.error(error);
   } finally {
     setLoading(false);
   }
  }

  const getName3 = async () => {
    try {
     const response = await fetch(uri3);
     const json = await response.json();
     setName3(json.name);
   } catch (error) {
     console.error(error);
   } finally {
     setLoading(false);
   }
  }

  useEffect(() => {
    getName1(uri1);
    getName2(uri2);
    getName3(uri3);
  },[]);

  return (
    <View style={styles.container}>
      
      <Text style={styles.text}>Release date: {movie.release}</Text>
      <Text style={styles.text}>Director: {movie.director}</Text>
      <Text style={{padding: 5, borderBottomWidth: 1}}>Producer: {movie.producer}</Text>
      <Text style={styles.sectionHeader}>Opening Crawl</Text>
      <Text style={styles.crawl}>{movie.opening_crawl}</Text>
            
      <SectionList 
        sections={[
          {title: 'Characters', data: [name1, name2, name3]}
        ]}
        renderItem={({item}) => <Text style={styles.item}>
          {item}
        </Text>}
        renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
        keyExtractor={(item, index) => index}
      />
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{
        headerTintColor: 'white',
        headerStyle: {backgroundColor: 'grey'}
      }}>
        <Stack.Screen name="Home" component={HomeScreen} 
          options={{ 
            title: 'Star Wars Movies',
            headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 30
          }}}/>
        <Stack.Screen name="Home_to_Details" component={DetailsScreen} 
          options={ ( {route} ) => ({title: route.params.movie.title})}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 5,
   fontSize: 14,
  },
  text: {
    padding: 5
  },
  title: {
    fontSize: 20,
    padding: 10
  },
  button: {
    height: 50, 
    backgroundColor: 'powderblue'
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'grey',
    borderBottomWidth: 1
  },
  item: {
    padding: 2,
    fontSize: 14,
    height: 24,
    borderBottomWidth: 1
  },
  crawl: {
    fontSize: 8,
    borderBottomWidth: 1,
    padding: 5,
  }
})

export default App;
