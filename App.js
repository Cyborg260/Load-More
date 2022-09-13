import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { fakeServer } from './components/fakeServer';

const renderItem = ({ item }) => {
  return (
    <SafeAreaView style={{ backgroundColor: "red" }}>
      <View style={{ backgroundColor: '#00ffff', margin: 20 }}>
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 32,
            padding: 15,
            borderBottomColor: 'blue',
            borderBottomWidth: 4,
            color: 'red',
            padding: 20
          }}
        >
          {item}
        </Text>

        {/* <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item style={styles.container} flexDirection="column" alignItems="center" marginTop={40}>
            <SkeletonPlaceholder.Item Image={styles.tinyLogo} width={180} height={180} borderRadius={150} />
            <SkeletonPlaceholder.Item marginLeft={20}>
              <SkeletonPlaceholder.Item marginTop={6} width={200} height={20} borderRadius={4} />
              <SkeletonPlaceholder.Item
                marginTop={6}
                width={150}
                height={20}
                borderRadius={4}
              />
              <SkeletonPlaceholder.Item marginTop={6} width={100} height={20} borderRadius={4} />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder> */}

      </View>
    </SafeAreaView>
  );
};

let stopFetchMore = true;

const ListFooterComponent = () => (
  <Text
    style={{
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      padding: 5,
      color: 'green',
      backgroundColor: "yellow"
    }}
  >
    Loading...
  </Text>
);

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

function App() {
  const [data, setData] = useState([
]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing,setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait(1500).then(() => setRefreshing(false));
  }, []);

  const fetchData = async () => {
    const response = await fakeServer(25);
    setData([...response]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOnEndReached = async () => {
    setLoadingMore(true);
    if (!stopFetchMore) {
      const response = await fakeServer(20);
      if (response === 'done')
        return setLoadingMore(false);
      setData([...data, ...response]);
      stopFetchMore = true;
    }
    setLoadingMore(false);
  };

  return (
    <FlatList
      data={data}
      keyExtractor={item => item}
      renderItem={renderItem}
      refreshing={refreshing}
      onRefresh={setData}
      onEndReached={handleOnEndReached}
      onEndReachedThreshold={0.5}
      onScrollBeginDrag={() => {
        stopFetchMore = false;
      }}
      ListFooterComponent={() => loadingMore && <ListFooterComponent />}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;   