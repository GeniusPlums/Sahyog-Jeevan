import React from 'react';
import { StyleSheet, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { colors, spacing, borderRadius, shadows, typography } from '../theme';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.97);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const getButtonStyle = () => {
    let buttonStyle = {};
    
    // Variant styles
    if (variant === 'primary') {
      buttonStyle = styles.primaryButton;
    } else if (variant === 'secondary') {
      buttonStyle = styles.secondaryButton;
    } else if (variant === 'outline') {
      buttonStyle = styles.outlineButton;
    }
    
    // Size styles
    if (size === 'sm') {
      buttonStyle = { ...buttonStyle, ...styles.smallButton };
    } else if (size === 'lg') {
      buttonStyle = { ...buttonStyle, ...styles.largeButton };
    }
    
    // Width style
    if (fullWidth) {
      buttonStyle = { ...buttonStyle, ...styles.fullWidth };
    }
    
    // Disabled style
    if (disabled) {
      buttonStyle = { ...buttonStyle, ...styles.disabledButton };
    }
    
    return buttonStyle;
  };

  const getTextStyle = () => {
    if (variant === 'primary') {
      return styles.primaryText;
    } else if (variant === 'secondary') {
      return styles.secondaryText;
    } else if (variant === 'outline') {
      return styles.outlineText;
    }
  };

  return (
    <Animated.View style={[styles.container, fullWidth && styles.fullWidth, animatedStyle]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[styles.button, getButtonStyle()]}
      >
        {loading ? (
          <ActivityIndicator 
            size="small" 
            color={variant === 'outline' ? colors.primary : 'white'} 
          />
        ) : (
          <View style={styles.contentContainer}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={[styles.text, getTextStyle()]}>{title}</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  button: {
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  smallButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  largeButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  disabledButton: {
    backgroundColor: colors.secondaryLight,
    borderColor: colors.secondaryLight,
    opacity: 0.7,
  },
  fullWidth: {
    width: '100%',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: spacing.xs,
  },
  text: {
    fontWeight: '500' as const,
    fontSize: typography.fontSizes.md,
  },
  primaryText: {
    color: 'white',
  },
  secondaryText: {
    color: 'white',
  },
  outlineText: {
    color: colors.primary,
  },
});

export default Button;
