---
title: Evaluating PostGIS support in Typescript ORMs
description: A short exploration of popular Typescript ORMs and their PostGIS support constraints
date: 2023-06-25
---

## Comparing Postgres ORMs

There are some wonderful typescript ORMs for Postgres available these days!
I'm going to review a few popular options and investigate the tradeoffs

- `supabase`
- `MikroORM`
- `prisma`
- `typeorm`

Finally, I will provide some pointers as to the best approaches.

## Common Use Case: ST_INTERSECTS()

Here I will outlay a common use case, and the most important constraints that come up with working with geospatial data and these ORMs

### The Schema

All of the clients allow you to define `geography` columns and other PostGIS datatypes in some way or another. In some cases they have built-in support, in other cases, they provide the flexibility to specify a column type.

You'll find that if you use this as your only starting criteria, you may be dissapointed when you take a few steps further with constructing PostGIS-enabled queries against these schemas.

### The `WHERE` clause

One of the most common use cases I found for our users was [`ST_INTERSECTS()`](https://postgis.net/docs/ST_Intersects.html). for example, `WHERE ST_INTERSECTS(geom, anothergeom)`. [](https://postgis.net/docs/ST_Intersects.html)

It's often that PostGIS extension methods are used in `WHERE` clauses. It seems the flexibility of `WHERE` clauses is a useful indicator for the viability of an ORM when it comes to using extensions like `PostGIS`.

Depending on the nature of your PostGIS enabled application, you may more often need methods like [`ST_DISTANCE()`](https://postgis.net/docs/ST_Distance.html), etc, but fear not, as this discussion applies to any postgres extension that requires the use of methods like these in `WHERE` clauses.

### `INSERT` clauses!

Almost all of the below support `INSERT` clauses with PostGIS methods, in some way or another.

This is also of course important - you need to get the data into the database to be able to query it of course!

However, the main reason many of us use PostGIS is because of `WHERE` clauses, so the focus of this article will be mostly on the flexibility of constructing `WHERE` clauses, which I found was the major pain point between these various ORMs when PostGIS was part of the picture.

### Serializing `GeoJSON`

Another common use case is serializing GeoJSON features for the query. Even with strong validation, it's easy for REST APIs that accept user-supplied GeoJSON to contain potentially harmful input.
`ST_GeomFromGeoJSON()` is the method we will use. A good PostGIS enabled ORM should be able to be hands off here, and you'll find that most of them are.

## `supabase-js`

This is an excellent ORM and platform, provided the necessary PostGIS datatypes (though I had a few bugs with these iirc), and available configuration to enable the PostGIS extension, however you can only construct these queries using custom PostgreSQL functions, which required lots of migrations as we fine tuned the queries over the application lifecycle

We eventually ended up with a blocking issue, despite working with the supabase team to try to make them work, we ended up [with strange GEOS errors](https://github.com/orgs/supabase/discussions/14013) that they were never able to resolve. The query worked fine in the local CLI that provisioned docker containers, but on the platform we got strange errors that we weren't able to resolve, despite making many tweaks to the PostgreSQL function (and incurring many repeat migrations to test the change on the platform).

If you're using supabase, hopefully you don't encounter this issue! Perhaps it's related to a platform issue that only is impacted by `ST_INTERSECTS()`.

## `prisma-client-js`

Prisma is another wonderful ORM. Probably my favorite personally.

It's possible with `prisma` to conduct this query, but only by using the `sql`\`\` template tag syntax.

This is fine for many options, though it doesn't give the programmatic flexibility we might get from other solutions, it [_does sanitize user input_](https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#using-variables) when using `$queryRaw`. That is extremely important.

```ts
const zones = await prisma.$queryRaw(
  Prisma.sql`SELECT * FROM zones WHERE ST_Intersects(Zone.polygon, ST_GeomFromGeoJSON(${JSON.stringify(
    polygon
  )}))`
);
```

If you are flying along with prisma and only stuck on PostGIS or similar Postgres extensions in a few places, this may be a worthwile shortcut until better options are available.

You could even build a simple abstraction like this:

```ts
async function getIntersections(
  tableName: string,
  polygon: Polygon,
  fieldName?: string
) {
  return prisma.$queryRaw(
    Prisma.sql`SELECT * FROM ${tableName} WHERE ST_Intersects(${tableName}.${
      fieldName ?? "polygon"
    }, ST_GeomFromGeoJSON(${JSON.stringify(polygon)}))`
  );
}

const zones = await getIntersections("zone", polygon, "polygon");
```

When recently building a tool that implemented a climate science team's carbon sequestration prediction models, this would have covered 90% of my use cases!

## `MikroORM`

This is an excellent ORM that I hope to make more use of in the future!

Like with supabase or prisma, the `where()` method expects an object, which limits us from using specialized extension methods like `ST_INTERSECTS()`.

Also, like with supabase, there was no way to construct a custom SQL query. So you are essentially prevented from using specialized methods.

## `TypeOrm`

Finally, `TypeOrm` gave the most flexibility I could find for an ORM that fit our use case.

In the case of TypeORM, the `.where()` method gave us the flexibility we needed. It allowed for supplying a string for the where clause instead of an object.

```ts
const zones = await getConnection()
  .getRepository(Zone)
  .createQueryBuilder("Zone")
  .where("ST_Intersects(Zone.polygon, ST_GeomFromGeoJSON(:polygon))", {
    polygon: feature.geometry,
  })
  .getMany();
```

And, as with the other ORMs, you can still use a handy `where` object pattern in `TypeORM` like this:

```ts
const zones = await getConnection()
  .getRepository(Example)
  .find({
    where: [{ exampleField: "exampleValue" }],
  });
```
Whether this is more ideal than prisma is up to you. In our case we preferred it, but you might find the advantages of prisma outweigh the few additional benefits here.

## Should I use an ORM?

Most likely, yes. The normal alternative, building a custom DBAL (database abstraction layer), can be time consuming, high maintenance, and fraught with peril.

However, if you often find yourself pushing against the constraints of ORMs, and find yourself more often needing to write highly specialized queries using extensions like PostGIS, it may be worth it as an alternative (or hopefully a compliment) to an ORM.

This would consist of taking a low-level Postgres driver or client, and constructing classes and/or high order functions to deal with instantiation and more.  I have built these before with Postgres, MySQL, MongoDB, and other engines for various purposes.

While this approach can be better suited to your custom data domain, it often becomes a bottleneck and a major risk factor in any engineering organization.

If your engineers are most familiar with ORMs, you should probably stick to using ORMs!


## The TLDR

1. Most Typescript ORMs for Postgres support getting the geospatial data _into_ the database. Dat types for the schema, serializing and inserting data are all possible.
2. Of the ORMs I looked at, only `Prisma` and `TypeOrm` allowed us to construct the `WHERE` clauses we needed. This is the bread and butter of PostGIS.
