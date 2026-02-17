export function getOrInsert<TKey, TValue>(
	map: Map<TKey, TValue>,
	key: TKey,
	defaultVal: TValue,
): TValue {
	const presentVal = map.get(key);

	if (presentVal !== undefined) return presentVal;
	else map.set(key, defaultVal);

	return defaultVal;
}
