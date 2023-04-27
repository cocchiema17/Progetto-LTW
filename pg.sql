create table "user" (
  "id" uuid default gen_random_uuid(),
  "firstName" varchar(30) not null,
  "lastName" varchar(30) not null,
  "email" varchar(60) not null unique,
  "password" varchar(200) not null,
  "createdAt" timestamp default CURRENT_TIMESTAMP check ("createdAt" <= CURRENT_TIMESTAMP),
  "emailActivated" boolean default false,
  "emailActivatedAt" timestamp check ("emailActivatedAt" <= CURRENT_TIMESTAMP),
  primary key(id)
);

create table "passwordReset" (
  "userId" uuid not null,
  "token" varchar(200) not null,
  "expiresAt" timestamp not null ,
  "consumed" boolean default false,
  primary key("userId", "token")
);

create table "space" (
  "id" uuid not null,
  "name" varchar(40) not null unique,
  "userId" uuid not null,
  "createdAt" timestamp not null default CURRENT_TIMESTAMP check ("createdAt" <= CURRENT_TIMESTAMP),
  primary key ("id") 
);

create table "category" (
  "name" varchar(40),
  "spaceId" uuid not null,
  "color" varchar(40),
  primary key("space", "name")
);

create type "transactionType" AS ENUM ('revenue', 'expense');

create table "transaction" (
  "id" uuid not null,
  "title" varchar(40) not null,
  "description" varchar(200) not null,
  "type" transactionType not null,
  "value" double not null,
  "currency" varchar(10) not null,
  "categoryName" varchar(40),
  "spaceId" uuid not null 
  "transactionDate" date default CURRENT_DATE check ("transactionDate" <= CURRENT_DATE),
  primary key ("id")
);

create table "attachment" (
  "id" bigserial not null,
  "rawContent" bytea not null,
  "transactionId" uuid not null,
  primary key("id")
);

alter table "passwordReset" add foreign key ("userId") REFERENCES "user" ("id");
alter table "space" add foreign key ("userId") REFERENCES "user" ("id");
alter table "category" add foreign key ("spaceId") REFERENCES "space" ("id");
alter table "transaction" add foreign key ("categoryName", "spaceId") REFERENCES "category" ("name", "spaceId");
alter table "attachment" add foreign key ("transactionId") REFERENCES "transaction" ("id");
