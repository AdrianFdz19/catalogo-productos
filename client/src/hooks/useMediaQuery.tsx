import React, { useEffect, useState } from 'react'

export default function useMediaQuery(width = 768) {

    const [state, setState] = useState<boolean>(window.innerWidth <= width);

    useEffect(() => {

        const handleWindowResize = () => {
            setState(window.innerWidth <= width);
        };

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };

    }, [width]);

  return state;
}
