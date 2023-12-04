import { useEffect, useState } from "react";

export const useDebounce = (text) => {
	const [debouncedValue, setDebouncedValue] = useState(text);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedValue(text);
		}, 200);

		return () => {
			clearTimeout(timer);
		};
	}, [text]);

	return debouncedValue;
};
