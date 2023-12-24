import { useEffect, useState } from "react";

export const useDebounce = (text: string) => {
	const [debouncedValue, setDebouncedValue] = useState(text);

	useEffect(() => {
		const timerID = setTimeout(() => {
			setDebouncedValue(text);
		}, 200);

		return () => {
			clearTimeout(timerID);
		};
	}, [text]);

	return debouncedValue;
};
