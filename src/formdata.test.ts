import assert from "node:assert";
import {describe, test} from "node:test";
import {formDataToObject} from "./formdata.js";

describe("formDataToObject", () => {
	test("handles arrays with index notation correctly", () => {
		const formData = new FormData();
		formData.append("year", "12");
		formData.append("code", "B");
		formData.append("studentCount", "25");
		formData.append("domainId", "desenvolvimento-sustentavel");
		formData.append("programIds[0]", "plataforma-mypolis");
		formData.append("programIds[1]", "exploradores-da-cidadania");

		assert.deepStrictEqual(formDataToObject(formData), {
			code: "B",
			domainId: "desenvolvimento-sustentavel",
			programIds: ["plataforma-mypolis", "exploradores-da-cidadania"],
			studentCount: "25",
			year: "12"
		});
	});

	test("handles sparse arrays with index notation correctly", () => {
		const formData = new FormData();
		formData.append("items[0]", "first");
		formData.append("items[2]", "third");

		const result = formDataToObject(formData);

		assert.deepStrictEqual(result.items, ["first", undefined, "third"]);
	});

	test("handles arrays with empty bracket [] notation correctly", () => {
		const formData = new FormData();
		formData.append("items[]", "first");
		formData.append("items[]", "second");

		const result = formDataToObject(formData);

		assert.deepStrictEqual(result.items, ["first", "second"]);
	});

	test("handles arrays with same name repeated correctly", () => {
		const formData = new FormData();
		formData.append("items", "first");
		formData.append("items", "second");

		const result = formDataToObject(formData);

		assert.deepStrictEqual(result.items, ["first", "second"]);
	});

	test("handles nested objects correctly", () => {
		const formData = new FormData();
		formData.append("user[name]", "John");
		formData.append("user[address][city]", "Lisbon");
		formData.append("user[address][zip]", "1000-001");

		assert.deepStrictEqual(formDataToObject(formData), {
			user: {
				name: "John",
				address: {
					city: "Lisbon",
					zip: "1000-001"
				}
			}
		});
	});

	test("handles complex nested arrays and objects", () => {
		const formData = new FormData();
		formData.append("classes[1][name]", "11B");
		formData.append("classes[1][students][0]", "Maria");
		formData.append("classes[0][name]", "10A");
		formData.append("classes[0][students][0]", "Ana");
		formData.append("classes[0][students][1]", "João");

		assert.deepStrictEqual(formDataToObject(formData), {
			classes: [
				{name: "10A", students: ["Ana", "João"]},
				{name: "11B", students: ["Maria"]}
			]
		});
	});

	test("handles arrays of objects with empty indices correctly", () => {
		const formData = new FormData();
		formData.append("classrooms[][school]", "");
		formData.append("classrooms[][year]", "");
		formData.append("classrooms[][code]", "");
		formData.append("classrooms[][studentCount]", "");

		formData.append("classrooms[][school]", "Escola Secundária A");
		formData.append("classrooms[][year]", "10");
		formData.append("classrooms[][code]", "A");
		formData.append("classrooms[][studentCount]", "30");

		assert.deepStrictEqual(formDataToObject(formData), {
			classrooms: [
				{school: "", year: "", code: "", studentCount: ""},
				{school: "Escola Secundária A", year: "10", code: "A", studentCount: "30"}
			]
		});
	});
});
