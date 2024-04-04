import React, {useState, useEffect} from 'react';
import AppText from './AppText/AppText';

function Greeting({user}) {
    const [greet, setGreet ] = useState('Evening')
    const findGreet = () => {
        const hrs = new Date().getHours();
        if(hrs === 0 || hrs < 12) return setGreet('Morning');
        if(hrs >= 12 && hrs < 17 ) return setGreet('Afternoon');
        setGreet('Evening')
    }
    useEffect(() => {
        findGreet()
    }, [])
    return (
        <AppText>{`Good ${greet} ${user.name}!`}</AppText>
    );
}

export default Greeting;