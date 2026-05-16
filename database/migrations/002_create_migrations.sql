create table migrations(
	id BIGSERIAL primary key,
	file_name text not  null,
	executed_at timestamp not null default now()
);