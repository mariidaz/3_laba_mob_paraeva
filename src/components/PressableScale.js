import React, { useState } from 'react';
import { Animated, Pressable } from 'react-native';

export default function PressableScale({ children, onPress, style, disabled, accessibilityLabel }) {
  const [scale] = useState(() => new Animated.Value(1));
  const animate = (toValue) => Animated.spring(scale, {
    toValue, useNativeDriver: true, speed: 28, bounciness: 4,
  }).start();

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        disabled={disabled}
        onPress={onPress}
        onPressIn={() => animate(0.975)}
        onPressOut={() => animate(1)}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
