CREATE SCHEMA "finager";

create table "finager.user" (
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

create table "finager.passwordReset" (
  "userId" uuid not null,
  "token" varchar(200) not null,
  "expiresAt" timestamp not null ,
  "consumed" boolean default false,
  primary key("userId", "token")
);

alter table "finager.passwordReset" add foreign key ("userId") REFERENCES "finager.user" ("id");
