import React from 'react';
import { View } from 'react-native';
import { Dimensions } from 'react-native';
import { StyleSheet } from 'react-native';
import { BoxShadow } from 'react-native-shadow';


const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const NeoMorphContainer = ({children, width, height, opacity, color}) => {
    
    const shadowBottom = {
        width: screenWidth / 100 * (width || 80),
        height: screenHeight / 100 * (height ||  10),
        color: color || "#B7C4DD",
        border:2,
        radius:10,
        opacity: opacity || 1,
        x:6,
        y:6,
    }

   return (<View style={styles.container}>
           <BoxShadow setting={shadowBottom}>
               {children}
           </BoxShadow>
       </View>)
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10
    }
})

export default NeoMorphContainer;