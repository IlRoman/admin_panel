import { useEffect } from "react";

export const useInfiniteScroll = (ref, setPage, setFetching, canLoad) => {
    const scrollHandler = (e) => {
        if (e.target.scrollHeight - (e.target.scrollTop + ref.current.offsetHeight) <= 0) {
            if (canLoad) {
                setPage(prev => prev + 1);
                setFetching(true);
            }
        } else {
            setFetching(false);
        }
    };

    useEffect(() => {
        if (ref.current) {
            ref.current.addEventListener('scroll', scrollHandler);
        }

        return function () {
            if (ref.current) {
                ref.current.removeEventListener('scroll', scrollHandler);
            }
        }
    });
};
