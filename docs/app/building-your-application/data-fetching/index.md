# Data Fetching

Learn how to fetch, cache, revalidate, and mutate data with Next.js.

---

## Overview

Data fetching is a core concept in Next.js. It allows you to fetch data for a page before it's rendered. This document will cover the following:

- **Static Generation**: Building time data fetching.
- **Client-side Hydration**: Client-side data fetching.
- **Incremental Static Regeneration**: Update static pages without re-building the entire site.
- **API Routes**: Server-side data fetching.
- **Custom Server**: Using a custom server for data fetching.

## Static Generation

Static Generation is the process of pre-rendering a page at build time. With Next.js, you can use `getStaticProps` to fetch data before a page is rendered.

### When to Use

You should use Static Generation when:

- The data does not change frequently.
- You want the fastest delivery to the user by pre-rendering pages.

### How to Use

To use Static Generation, you can export `getStaticProps` from your page:

```jsx
export async function getStaticProps() {
  return {
    props: {
      data: // the data you need for your page to render
    }
  };
}
```

### Caching

Next.js automatically caches the output of your `getStaticProps` function. This means that:

- Subsequent requests for the same page will not run `getStaticProps` again.
- `getStaticProps` will run after a certain period, which you can configure with `revalidate` in `next.config.js`.

### Revalidating

To revalidate the data after the cache expires, you can use the `revalidate` property in `getStaticProps`:

```jsx
export async function getStaticProps({ preview = false, revalidate }) {
  return {
    props: {
      data: // fetch your data
    },
    revalidate: revalidate // in seconds
  };
}
```

## Client-side Hydration

Client-side Hydration allows you to fetch data on the client side. This is useful when you need to fetch data that is specific to the user.

### When to Use

You should use Client-side Hydration when:

- The data is user-specific.
- The data changes frequently.

### How to Use

To use Client-side Hydration, you can use the `useEffect` hook in your component:

```jsx
import useSWR from 'swr';

function Page() {
  const { data, error } = useSWR('/api/data', fetcher);

  if (error) return <div>Error!</div>;
  if (!data) return <div>Loading...</div>;

  return <div>{data}</div>;
}
```

## Incremental Static Regeneration

Incremental Static Regeneration (ISR) allows you to update static pages without rebuilding the entire site. This is useful when you want to update a specific page without affecting the rest of your site.

### When to Use

You should use ISR when:

- You want to update a specific page without rebuilding the entire site.
- You want to update data that changes frequently.

### How to Use

To use ISR, you can add a `revalidate` property to your `getStaticProps` function:

```jsx
export async function getStaticProps({ preview = false, revalidate }) {
  return {
    props: {
      data: // fetch your data
    },
    revalidate: 3 // in seconds
  };
}
```

## API Routes

API Routes allow you to create server-side functions that can be used to fetch data.

### When to Use

You should use API Routes when:

- You want to fetch data on the server-side.
- You want to use server-side logic to process data.

### How to Use

To use API Routes, you can create a file in the `pages/api` directory:

```jsx
// pages/api/data.js
export default async function handler(req, res) {
  const data = await fetch('your-api-endpoint')
    .then((res) => res.json());

  res.status(200).json(data);
}
```

## Custom Server

Using a custom server allows you to have full control over data fetching.

### When to Use

You should use a custom server when:

- You want full control over data fetching.
- You need to use a specific server technology.

### How to Use

To use a custom server, you can create a custom server file:

```jsx
// server.js
const express = require('express');
const next = require('next');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare