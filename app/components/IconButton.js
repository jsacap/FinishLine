import React from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import colors from '../config/colors';

function IconButton({ iconName, size, color }) {
    return (
        <FontAwesome5 name={iconName} size={size || 24} color={color || colors.black} />
    );
}

export default IconButton;