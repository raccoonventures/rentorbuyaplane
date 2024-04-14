export function setNestedObject(obj, path, value) {
	let current = obj;
	for (let i = 0; i < path.length - 1; i++) {
		const key = path[i];
		if (!current[key]) {
			current[key] = {};
		}
		current = current[key];
	}
	const lastKey = path[path.length - 1];
	current[lastKey] = value;
}

export function toQueryString(params, prefix = '') {
	const parts = [];
	for (const key in params) {
		if (Object.prototype.hasOwnProperty.call(params, key)) {
			const value = params[key];
			const fullKey = prefix
				? `${prefix}[${encodeURIComponent(key)}]`
				: encodeURIComponent(key);
			// If the value is an object and not an array, recursively process the object
			if (
				typeof value === 'object' &&
				value !== null &&
				!Array.isArray(value)
			) {
				parts.push(toQueryString(value, fullKey));
			} else {
				// If the value is an array, iterate over its elements
				if (Array.isArray(value)) {
					value.forEach((item) => {
						parts.push(`${fullKey}[]=${encodeURIComponent(item)}`);
					});
				} else {
					// Otherwise, add the encoded key-value pair to the parts array
					parts.push(`${fullKey}=${encodeURIComponent(value)}`);
				}
			}
		}
	}
	return parts.join('&');
}
