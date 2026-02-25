/**
 * Process FormData into a structured object
 */
export function formDataToObject(source: FormData): Record<string, any> {
	const result: Record<string, any> = {};

	for (const [key, value] of source) {
		const parts = key.replace(/\]/g, "").split("[");
		let current: any = result;

		for (let i = 0; i < parts.length - 1; i++) {
			const keyPart = parts[i];
			const nextPart = parts[i + 1];

			if (keyPart === "") {
				// Handle array push notation '[]'
				let lastElement = current[current.length - 1];

				const shouldPush =
					current.length === 0 ||
					typeof lastElement !== "object" ||
					lastElement === null ||
					(nextPart !== "" &&
						Object.prototype.hasOwnProperty.call(lastElement, nextPart));

				if (shouldPush) {
					const isNextArray = nextPart === "" || /^\d+$/.test(nextPart);
					const newElement = isNextArray ? [] : {};
					current.push(newElement);
					lastElement = newElement;
				}

				current = lastElement;
			} else {
				// Handle keys or indices
				// We need to initialize if the key doesn't exist OR if it exists but is undefined (placeholder)
				if (
					!Object.prototype.hasOwnProperty.call(current, keyPart) ||
					current[keyPart] === undefined
				) {
					// Only fill gaps if strictly NOT existing
					if (!Object.prototype.hasOwnProperty.call(current, keyPart)) {
						if (Array.isArray(current)) {
							const idx = Number(keyPart);
							if (!isNaN(idx)) {
								while (current.length < idx) {
									current.push(undefined);
								}
							}
						}
					}

					const isNextArray = nextPart === "" || /^\d+$/.test(nextPart);
					current[keyPart] = isNextArray ? [] : {};
				}

				current = current[keyPart];
			}
		}

		const lastPart = parts[parts.length - 1];

		if (lastPart === "") {
			current.push(value);
		} else {
			// If current is an array and we are skipping indices, fill with undefined
			if (Array.isArray(current)) {
				const idx = Number(lastPart);
				if (!isNaN(idx)) {
					while (current.length < idx) {
						current.push(undefined);
					}
				}
			}

			if (
				Object.prototype.hasOwnProperty.call(current, lastPart) &&
				current[lastPart] !== undefined
			) {
				const existing = current[lastPart];
				if (Array.isArray(existing)) {
					existing.push(value);
				} else {
					current[lastPart] = [existing, value];
				}
			} else {
				current[lastPart] = value;
			}
		}
	}

	return result;
}
