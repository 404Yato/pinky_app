create table item_types(
	id BIGSERIAL primary key,
	name varchar(255) not null,
	created_at timestamp not null default now(),
	updated_at timestamp,
	deleted_at timestamp
);

create table items(
	id BIGSERIAL primary KEY,
	user_id bigint not null,
	name varchar(255) not null,
	description text,
	type_id bigint,
	created_at timestamp not null default now(),
	updated_at timestamp,
	deleted_at timestamp,
	
	constraint fk_items_user
		foreign key (user_id)
		references users(id)
		on delete cascade,
	
	constraint fk_item_types
		foreign key (type_id)
		references item_types(id)
		on delete restrict
	);