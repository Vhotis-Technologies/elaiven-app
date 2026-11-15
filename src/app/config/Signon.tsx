import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Signon = () => {
  return (
    <View style={styles.container}>
        <Pressable style={styles.button}>
            <Text>Sign on</Text>
        </Pressable>
    </View>
  )
}

export default Signon

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    
    button:{
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        marginBottom: 10,
    }
})