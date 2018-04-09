import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  PanResponder,
  Animated,
  StatusBar,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';

let itemArray = [];
for (var index = 0; index < 22; index++) {
  itemArray.push({id: index, text: 'Lorem ipsum dolar set amet'});
}

const imagePileList = [
  {key: '001', img: require('./static/r8.jpeg'), text: 'Lorem ipsum'},
  {key: '002', img: require('./static/r8.jpeg'), text: 'Lorem ipsum'},
  {key: '003', img: require('./static/r8.jpeg'), text: 'Lorem ipsum'},
  {key: '004', img: require('./static/r8.jpeg'), text: 'Lorem ipsum'},
]

export default class App extends React.Component {

  state = {
    itemArray,
    imagePile: imagePileList,
    isUp: false,
    scrollListUp: false,
    up: new Animated.Value(0),
    b: new Animated.Value(0),
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!
        if (this.state.isUp) {
          Animated.spring(this.state.up, { toValue: 0, duration: 1000 }).start();
        } else {
          Animated.spring(this.state.up, { toValue: 1, duration: 1000 }).start();
        }
        this.setState({ isUp: !this.state.isUp });
        // gestureState.d{x,y} will be set to zero now
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
        return false
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return !this.state.scrolling;
      },
    });

    const self = this;

    this.bounce = setInterval(function() {
      Animated.sequence([
        Animated.timing(self.state.b, { toValue: 1, duration: 200 }),
        Animated.timing(self.state.b, { toValue: 0, duration: 200 })
      ]).start();
    }, 5000)
  }

  render() {
    const { isUp, itemArray, imagePile, scrollListUp } = this.state;
    const up = this.state.up.interpolate({
      inputRange: [0, 1],
      outputRange: ['78%', '20%'],
    });

    const bounce = this.state.b.interpolate({
      inputRange: [0, 1],
      outputRange: ['80%', '75%'],
    });

    return (
      <View style={[styles.container]}>
        <StatusBar hidden={true} />
        {!scrollListUp && (
          <ImageBackground source={require('./static/blueAudi.jpg')} style={[styles.container, {height: isUp ? '30%' : '100%'}]}>
            <View style={styles.navBar}>
              <Text style={styles.navItem}>Back</Text>
              <Text style={styles.navItem}>Find</Text>
            </View>
          </ImageBackground>
        )}
        {scrollListUp && (
          <ImageBackground
            source={require('./static/blueAudi.jpg')}
            style={[
              styles.container,
              {height: '10%', borderBottomLeftRadius: 80, borderBottomRightRadius: 80
            }]}
          >
            <View style={styles.navBar}>
              <Text style={styles.navItem}>Back</Text>
              <Image source={require('./static/driverProfile.jpg')} style={styles.profileImageSmall} />
              <Text style={{color: 'white', fontSize: 25, fontWeight: 'bold'}}>Lorem ispum...</Text>
              <Text style={styles.navItem}>Find</Text>
            </View>
          </ImageBackground>
        )}
        <Animated.View style={[scrollListUp ? styles.openView : styles.closedView, { top: isUp ? scrollListUp ? '10%' : up : bounce }]}>
          <View>
            <View style={styles.slideContainer}>
              {!scrollListUp && (
                <View {...this._panResponder.panHandlers} style={{width: '100%', height: 30}}>
                  <View style={styles.slideContainerHeader}>
                    <Image source={require('./static/driverProfile.jpg')} style={styles.profileImage} />
                    <View>
                      <Text style={{fontWeight: 'bold'}}>120</Text>
                      <Text>lore</Text>
                    </View>
                    <View style={{borderLeftWidth: 1, borderLeftColor: 'black', paddingLeft: 10}}>
                      <Text style={{fontWeight: 'bold'}}>1543</Text>
                      <Text>ipsum</Text>
                    </View>
                    <View style={{borderLeftWidth: 1, borderLeftColor: 'black', paddingLeft: 10}}>
                      <Text style={{fontWeight: 'bold'}}>825</Text>
                      <Text>dolor</Text>
                    </View>
                  </View>
                  <View style={styles.slideContainerContent}>
                    <Text style={{color: '#E68544', fontSize: 25, fontWeight: 'bold'}}>Lorem Ipsum</Text>
                    <Text style={{fontSize: 25}}>Lorem ipsum Dolar Set Amet</Text>
                    <Text style={{color: 'lightgrey'}}>Lorem ipsum Dolar</Text>
                  </View>
                </View>
              )}
              <View style={[styles.slideContainerScrollView, scrollListUp ? { paddingTop: 0 } : {}]}>
                {!scrollListUp && (
                  <View style={styles.buttonStars}>
                    <TouchableOpacity style={styles.button}><Text style={{color: 'white'}}>Lorem</Text></TouchableOpacity>
                    <Text>Star</Text>
                    <Text>Star</Text>
                  </View>
                )}
                {!scrollListUp && (
                  <View style={styles.flatList}>
                    <FlatList
                      data={imagePile}
                      keyExtractor={item => item.key}
                      onScroll={(e) => this.setState({endReached: e.nativeEvent.contentOffset.x > 50})}
                      renderItem={({item}) => (
                        <View style={{paddingRight: 10}}>
                          <Image source={item.img} style={{height: 50, width: 50, borderRadius: 6}} />
                          <Text>{item.text}</Text>
                        </View>
                      )}
                      horizontal={true}
                    />
                  </View>
                )}
                <View style={styles.swipeList}>
                  {!scrollListUp && (
                    <View style={styles.swipeHeader}>
                      <Text style={{color: !this.state.endReached ? 'black' : 'lightgrey' }}>grid</Text>
                      <Text style={{paddingLeft: 10, color: this.state.endReached ? 'black' : 'lightgrey'}}>star</Text>
                    </View>
                  )}
                  <ScrollView
                    style={{width: '100%', paddingBottom: 50}}
                    onScroll={(e) => {this.setState({scrollListUp: e.nativeEvent.contentOffset.y > 50})}}
                    scrollEventThrottle={16}
                  >
                    {isUp && itemArray.map(v => (
                      <View style={styles.arrayItem} key={v.id}>
                        <Text>{v.text}</Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'black',
  },
  navBar: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 15,
  },
  navItem: {
    color: 'white',
  },
  closedView: {
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 55,
    borderTopRightRadius: 55,
    height: '100%',
    position: 'absolute',
  },
  openView: {
    width: '100%',
    backgroundColor: 'white',
    height: '100%',
    position: 'absolute',
  },
  slideContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  slideContainerHeader: {
    position: 'absolute',
    top: 0,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 35,
    paddingLeft: '15%',
    paddingRight: '15%',
  },
  profileImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'white',
    marginBottom: 25,
  },
  profileImageSmall: {
    height: 30,
    width: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'white',
  },
  slideContainerContent: {
    paddingTop: 35,
    height: 80,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  buttonStars: {
    width: '50%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#E68544',
    borderRadius: 25,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 20,
    paddingRight: 20,
  },
  slideContainerScrollView: {
    paddingTop: 100,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  arrayItem: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 10,
    marginTop: 10,
  },
  flatList: {
    width: '70%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 10,
    paddingBottom: 10,
  },
  swipeList: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  swipeHeader: {
    width: '100%',
    alignSelf: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  }
});
