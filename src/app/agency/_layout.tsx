import { Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack, usePathname, useRouter } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useThemeColor } from '@/hooks/useThemeColor'
import StyledText from '@/components/helpers/StyledText'
import { useThemeContext } from '@/context/ThemeProvider'

type TabConfig = {
  name: string
  label: string
  href: string
  icon: React.ComponentProps<typeof MaterialIcons>['name']
}

const TABS: TabConfig[] = [
  { name: 'properties', label: 'Properties', href: '/agency/properties', icon: 'apartment' },
  { name: 'analytics', label: 'Analytics', href: '/agency/analytics', icon: 'analytics' },
  { name: 'home', label: 'Home', href: '/agency/home', icon: 'home' },
  { name: 'report', label: 'Reports', href: '/agency/report', icon: 'bar-chart' },
  { name: 'profile', label: 'Profile', href: '/agency/profile', icon: 'person-outline' },
]

const AgencyLayout = () => {
  const router = useRouter()
  const pathname = usePathname()
  const insets = useSafeAreaInsets()

  const { currentTheme } = useThemeContext()
  const barBackground = useThemeColor({}, 'background')
  const barBorder = useThemeColor({}, 'borders')
  const iconColor = useThemeColor({}, 'icons')
  const textColor = useThemeColor({}, 'text')
  const activeBackground = useThemeColor({}, 'borders')
  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='home' />
        <Stack.Screen name='analytics' />
        <Stack.Screen name='profile' />
        <Stack.Screen name='properties' />
        <Stack.Screen name='report' />
      </Stack>

      <View
        pointerEvents='box-none'
        style={[styles.overlay, { bottom: Math.max(insets.bottom, 12) }]}
      >
        <View style={styles.shadow}>
          <BlurView
            intensity={40}
            tint={currentTheme === 'dark' ? 'dark' : 'light'}
            style={[
              styles.bar,
              { backgroundColor: barBackground + 'CC', borderColor: barBorder },
            ]}
          >
            {TABS.map((tab) => {
              const active = pathname.startsWith(tab.href)
              return (
                <Pressable
                  key={tab.name}
                  style={styles.tab}
                  onPress={() => router.navigate(tab.href as any)}
                  accessibilityRole='button'
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={tab.label}
                >
                  <View
                    style={[
                      styles.iconWrap,
                      active && { paddingBottom:10 },
                    ]}
                  >
                    <MaterialIcons
                      name={tab.icon}
                      size={24}
                      color={active ? iconColor + 55 : iconColor}
                    />
                  </View>
                  <StyledText
                    style={[styles.label, active && styles.labelActive]}
                    color={active ? textColor : iconColor}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {tab.label}
                  </StyledText>
                </Pressable>
              )
            })}
          </BlurView>
        </View>
      </View>
    </View>
  )
}

export default AgencyLayout

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
  },

  overlay: {
    position: 'absolute',
    left: 8,
    right: 8,
  },

  shadow: {
    borderRadius: 30,
  },

  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 2,
  },

  iconWrap: {
    width: 52,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  label: {
    fontSize: 11,
    lineHeight: 14,
    textAlign: 'center',
    fontFamily: 'BarlowRegular',
  },

  labelActive: {
    fontFamily: 'BarlowMedium',
  },
})
