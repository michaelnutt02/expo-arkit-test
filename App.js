import React, {useState} from 'react';
import { Dimensions, PixelRatio, StyleSheet, TextStyle, ViewStyle } from "react-native"
import {
  ViroARScene,
  ViroText,
  ViroNode,
  ViroSpotLight,
  Viro3DObject,
  ViroConstants,
  ViroARSceneNavigator
} from '@viro-community/react-viro';

const HelloWorldSceneAR = () => {
  const [initialized, setInitialized] = useState(false)
  const [text, setText] = useState('Initializing AR...')
  const [firstNodePlaced, setFirstNodePlaced] = useState(false)
  const [distance, setDistance] = useState(0)

  const arSceneRef = React.createRef();
  const nodeRef1 = React.createRef();
  const nodeRef2 = React.createRef();
  const nodeRef3 = React.createRef();
  let hoverInterval = undefined;

  const _onTrackingUpdated = (state, reason) => {
    // if the state changes to "TRACKING_NORMAL" for the first time, then
    // that means the AR session has initialized!
    if (!initialized && state == ViroConstants.TRACKING_NORMAL) {
      setInitialized(true);
      setText('Hello World!');
    }
    else {

    }
  }

  const handleSceneClick = (source) => {
    nodeRef3.current?.getTransformAsync().then((transform) => {
      if(transform.position[0] + transform.position[1] + transform.position[2] != 0) {
        // We hit a plane, do something!
        if(firstNodePlaced) {
          console.log('move two')

          nodeRef2.current?.setNativeProps({
            position: transform.position,
            visible: true,
          })

          nodeRef1.current?.getTransformAsync().then((transformOne) => {
            getDistance(transformOne.position, transform.position)
          })
        
        } else {
          console.log('move one')
          
          nodeRef2.current?.setNativeProps({visible: false});

          nodeRef1.current?.setNativeProps({
            position: transform.position,
            visible: true
          })

          setFirstNodePlaced(true)
        }
      }
    })
  }

  const renderHoverNode = () => {
    arSceneRef.current?.performARHitTestWithPoint((Dimensions.get('window').width * PixelRatio.get())/2, (Dimensions.get('window').height * PixelRatio.get())/2)
      .then((results) => { 
        for (var i = 0; i < results.length; i++) {
          let result = results[i];
          // if (result.type == "ExistingPlaneUsingExtent") {
            
            // console.log('move hover')
              
            nodeRef3.current?.setNativeProps({
              position: result.transform.position,
              visible: true
            })
          // }
        }
      });
  }
  
  setInterval(()=>renderHoverNode(),100)

  const getDistance = (positionOne, positionTwo) => {
    // Compute the difference vector between the two hit locations.
    const dx = positionOne[0] - positionTwo[0];
    const dy = positionOne[1] - positionTwo[1];
    const dz = positionOne[2] - positionTwo[2];

    // // Compute the straight-line distance.
    const distanceMeters = Math.sqrt(dx*dx + dy*dy + dz*dz);

    console.log(distanceMeters*100)

    setDistance(distanceMeters*100)
  }

  const handleDrag = (dragToPos, source) => {
    nodeRef1.current?.getTransformAsync().then((transform) => {
      console.log(transform.position);

      getDistance(transform.position, dragToPos)
    })
  }

  function onInitialized(state, reason) {
    console.log('guncelleme', state, reason);
    if (state === ViroConstants.TRACKING_NORMAL) {
      setText('Hello World!');
    } else if (state === ViroConstants.TRACKING_NONE) {
      // Handle loss of tracking
    }
  }

  return (
    <ViroARScene ref={arSceneRef} onTrackingUpdated={_onTrackingUpdated} onClick={handleSceneClick}>
      <ViroText
        text={text}
        scale={[0.5, 0.5, 0.5]}
        position={[0, 0, -1]}
        style={styles.helloWorldTextStyle}
      />

      <ViroNode ref={nodeRef1} position={[0, 0, 0]} visible={false} onClick={() => {}}
        onDrag={()=>{}}
        dragType="FixedToWorld" 
      >
        <ViroSpotLight
          innerAngle={5}
          outerAngle={45}
          direction={[0,-1,-.2]}
          position={[0, 3, 0]}
          color="#ffffff"
          castsShadow={true}
          influenceBitMask={2}
          shadowMapSize={2048}
          shadowNearZ={2}
          shadowFarZ={5}
          shadowOpacity={.7} />

        <Viro3DObject
          source={require('./res/emoji_smile/emoji_smile.vrx')}
          position={[0, 0, 0]}
          scale={[.025, .025, .025]}
          type="VRX"
          lightReceivingBitMask={3}
          shadowCastingBitMask={2}
          transformBehaviors={['billboardY']}
          resources={[require('./res/emoji_smile/emoji_smile_diffuse.png'),
                      require('./res/emoji_smile/emoji_smile_specular.png'),
                      require('./res/emoji_smile/emoji_smile_normal.png')]}/>
      </ViroNode>

      <ViroNode ref={nodeRef2} position={[0, 0, 0]} visible={false} onClick={() => {}}
        onDrag={handleDrag}
        dragType="FixedToWorld" 
      >
        <ViroSpotLight
          innerAngle={5}
          outerAngle={45}
          direction={[0,-1,-.2]}
          position={[0, 3, 0]}
          color="#ffffff"
          castsShadow={true}
          influenceBitMask={2}
          shadowMapSize={2048}
          shadowNearZ={2}
          shadowFarZ={5}
          shadowOpacity={.7} />

        <Viro3DObject
          source={require('./res/emoji_smile/emoji_smile.vrx')}
          position={[0, 0, 0]}
          scale={[.025, .025, .025]}
          type="VRX"
          lightReceivingBitMask={3}
          shadowCastingBitMask={2}
          transformBehaviors={['billboardY']}
          resources={[require('./res/emoji_smile/emoji_smile_diffuse.png'),
                      require('./res/emoji_smile/emoji_smile_specular.png'),
                      require('./res/emoji_smile/emoji_smile_normal.png')]}/>

          <ViroText text={distance ? distance.toFixed(2) + 'cm' : ''} scale={[.1, .1, .1]} position={[0, 0, -0.05]} style={styles.helloWorldTextStyle} />
      </ViroNode>
      

      <ViroNode ref={nodeRef3} position={[0, 0, 0]} visible={false}>
        <ViroSpotLight
          innerAngle={5}
          outerAngle={45}
          direction={[0,-1,-.2]}
          position={[0, 3, 0]}
          color="#ffffff"
          castsShadow={true}
          influenceBitMask={2}
          shadowMapSize={2048}
          shadowNearZ={2}
          shadowFarZ={5}
          shadowOpacity={.7} />

        <Viro3DObject
          source={require('./res/emoji_smile/emoji_smile.vrx')}
          position={[0, 0, 0]}
          scale={[.025, .025, .025]}
          type="VRX"
          lightReceivingBitMask={3}
          shadowCastingBitMask={2}
          transformBehaviors={['billboardY']}
          resources={[require('./res/emoji_smile/emoji_smile_diffuse.png'),
                      require('./res/emoji_smile/emoji_smile_specular.png'),
                      require('./res/emoji_smile/emoji_smile_normal.png')]}/>

          <ViroText text="target" scale={[.2, .2, .2]} position={[0, 0, -0.05]} style={styles.helloWorldTextStyle} />
      </ViroNode>

    </ViroARScene>
  );
};

export default () => {
  return (
    <ViroARSceneNavigator
      autofocus={true}
      initialScene={{
        scene: HelloWorldSceneAR,
      }}
      style={styles.f1}
    />
  );
};

var styles = StyleSheet.create({
  f1: {flex: 1},
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});
