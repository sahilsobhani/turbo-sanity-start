import { defineType, defineField } from "sanity";

//what: create a new schema type for Pokemon
//why: task 3: create a pokemon schema and link it to the blog schema; to export pokemon schema
export const pokemon = defineType({
  name: "pokemon",
  title: "Pokemon",
  type: "object",
  fields: [
    defineField({ name: "id", type: "number", title: "ID", readOnly: true }),
    defineField({ name: "name", type: "string", title: "Name", readOnly: true }),
    defineField({ name: "sprite", type: "url", title: "Sprite", readOnly: true }),
    defineField({ name: "types", type: "array", title: "Types", of: [{ type: "string" }], readOnly: true }),
    defineField({ name: "base_experience", type: "number", title: "Base Experience", readOnly: true }),
    defineField({ name: "height", type: "number", title: "Height", readOnly: true }),
    defineField({ name: "weight", type: "number", title: "Weight", readOnly: true }),
  ],
});
