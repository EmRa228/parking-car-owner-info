This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Supabase Setup

1. Create a new project on [Supabase](https://supabase.com/).
2. Run the following SQL to create the necessary tables:

```sql
-- Cars table
create table cars (
    id serial primary key,
    plate varchar not null,
    color varchar,
    model varchar,
    inserted_at timestamp with time zone default timezone('utc'::text, now())
);

-- Owners table
create table owners (
    id serial primary key,
    name varchar not null,
    unit varchar,
    phone varchar,
    car_id integer references cars(id) on delete cascade
);
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

1. Connect your repository on [Vercel](https://vercel.com/).
2. Set the following environment variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
3. Deploy the project.

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


make a great next.js app based this information:
- this is an app for see car owner in parking who is parked his car in front of user cars and user want find it and call to his number
- user can search plate and will get info about cars, owner and a button for call with owner
- car data is: 
-- 1) plate
-- 2) color
-- 3) model
- owner car data is
-- name
-- unit name(department)
-- phone
- database of project is completely online with https://supabase.com/, help me for create tables and ...
- and finally I want deploy it on https://vercel.com/, help me with some details
- I want no login and data be public access but list of numbers not shows on first page and user see some stat and search filter on first page and when fill atleast one fields, User can see result as list(card for mobile view)
- design of website be modern and for 18-30 years old users.
- IRAN country plate itself has some fields. a plate is like: 77 د 568 IR99 and another plate is 54 الف 689 IR23
- all users can insert new data for cars in first page without login and only mobile and plate is required 

create all next.js files that need.

@workspace