import {
  NotFoundValueErrorDB,
  MissingValuesErrorDB,
} from "../../errors/index.js";
import { poolHostDB } from "../connect.js";

const empty = Symbol("Emptiness");
const filter = (
  val,
  { userModifiable = false, updatable = false, immutable = false }
) => {
  const userModifiableValues = ["title", "price", "company"];
  const updatableValues = ["featured", "rating"];
  const immutableValues = ["id", ["created_at", "createdAt"]];

  const values = [];
  if (userModifiable) values.push(...userModifiableValues);
  if (updatable) values.push(...updatableValues);
  if (immutable) values.push(...immutableValues);

  const filteredVal = {
    [empty]: true,
    keys: function () {
      const unwantedKeys = [
        "keys",
        "values",
        "missingValues",
        "setQueryString",
      ];
      return Object.keys(this).filter((key) =>
        unwantedKeys.every((v) => v !== key)
      );
    },
    values: function () {
      return this.keys().map((key) => this[key]);
    },
    missingValues: function () {
      const keys = this.keys();
      return values.filter((val) => keys.every((key) => key !== val));
    },
    setQueryString: function () {
      return this.keys()
        .map((key) => `${key} = ?`)
        .join(",");
    },
  };

  for (const dataKey of values) {
    if (Array.isArray(dataKey)) {
      let keyOfVal = null;
      if (dataKey.every((key) => !Object.hasOwn(val, key) || (keyOfVal = key)))
        continue;

      filteredVal[dataKey[0]] = val[keyOfVal];
      filteredVal[empty] = false;
    }
    if (Object.hasOwn(val, dataKey) && val[dataKey] !== undefined) {
      filteredVal[dataKey] = val[dataKey];
      filteredVal[empty] = false;
    }
  }

  return filteredVal;
};

export async function create({ title, price, company }) {
  const filteredObject = filter(
    { title, price, company },
    { userModifiable: true }
  );
  const missing = filteredObject.missingValues();
  if (missing.length) {
    throw new MissingValuesErrorDB(
      `product ${missing.join(" and ")} ${
        missing.length > 1 ? "are" : "is"
      } missing`
    );
  }

  const pool = await poolHostDB();
  const creation = await pool.query(
    `
        INSERT INTO products (title, price)
        VALUES (?, ?)
    `,
    [title, price]
  );

  return creation;
}

export async function read({ id, all = false }) {
  const pool = await poolHostDB();

  if (all) {
    const [[values]] = await pool.query("SELECT * FROM products");
    return values;
  }

  if (!id) {
    throw new MissingValuesErrorDB("product id is missing");
  }

  const [[value]] = await pool.query(
    `
        SELECT * FROM products
        WHERE id = ?
    `,
    [id]
  );
  return value;
}

export const update = async ({ id, newValue, completelyNew = false }) => {
  if (!id) {
    throw new MissingValuesErrorDB("product id is missing");
  }

  const pool = await poolHostDB();
  const updateValue = filter(newValue, { userModifiable: true });

  if (!updateValue.missingValues().length) {
    throw new MissingValuesErrorDB(
      `You must specify at least 1 field to update for product with id: ${id}`
    );
  }

  if (completelyNew) {
    // TODO: Implement the PUT http method effect here.
    // await del({ id });
    // return await create(updateValue);
  }

  const [{ affectedRows }] = await pool.query(
    `
        UPDATE products
        SET ${updateValue.setQueryString()}
        WHERE id = ?
    `,
    [...updateValue.values(), id]
  );

  if (affectedRows === 0) {
    throw new NotFoundValueErrorDB(`No product with id ${id} was found`);
  }

  return { id };
};

export async function del({ id }) {
  const pool = await poolHostDB();

  if (!id) {
    throw new MissingValuesErrorDB("product id is missing");
  }

  const [{ affectedRows }] = await pool.query(
    `
        DELETE FROM products
        WHERE id = ?
    `,
    [id]
  );

  if (affectedRows === 0) {
    throw new NotFoundValueErrorDB(`No product with id ${id} was found`);
  }

  return { deleted: true };
}
