import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


function useFindUser(props) {
    const [user, setUser] = useState({});
    useEffect(() => {
        const findUser = async () => {
            const result = await AsyncStorage.getItem('user');
            setUser(JSON.parse(result) || {});
        };
        findUser();
    }, []);
    return user;
    
}

export default useFindUser;