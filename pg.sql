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
  "userId" uuid,
  "token" varchar(200),
  "expiresAt" timestamp not null ,
  "consumed" boolean default false,
  primary key("userId", "token")
);

create table "space" (
  "id" bigserial,
  "name" varchar(40) not null unique,
  "userId" uuid not null,
  "createdAt" timestamp not null default CURRENT_TIMESTAMP check ("createdAt" <= CURRENT_TIMESTAMP),
  primary key ("id") 
);

create table "category" (
  "name" varchar(40),
  "spaceId" bigint,
  "color" varchar(40),
  primary key("name", "spaceId")
);

create type TransactionType AS ENUM ('revenue', 'expense');

create table "transaction" (
  "id" uuid default gen_random_uuid(),
  "title" varchar(40) not null,
  "description" varchar(200) not null,
  "type" TransactionType not null,
  "value" double precision not null,
  "categoryName" varchar(40),
  "spaceId" bigint not null,
  "transactionDate" date default CURRENT_DATE check ("transactionDate" <= CURRENT_DATE),
  primary key ("id")
);

create table "attachment" (
  "id" bigserial,
  "rawContent" bytea not null,
  "transactionId" uuid not null,
  primary key("id")
);

alter table "passwordReset" add foreign key ("userId") REFERENCES "user" ("id");
alter table "space" add foreign key ("userId") REFERENCES "user" ("id");
alter table "category" add foreign key ("spaceId") REFERENCES "space" ("id");
alter table "transaction" add foreign key ("categoryName", "spaceId") REFERENCES "category" ("name", "spaceId");
alter table "attachment" add foreign key ("transactionId") REFERENCES "transaction" ("id");
