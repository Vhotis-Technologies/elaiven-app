import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ConfigLayout = () => {
  return (
    <View style={styles.container}>
      <Text>ConfigLayout</Text>
    </View>
  )
}

export default ConfigLayout

const styles = StyleSheet.create({
    container:{
        flex: 1,
    }
})