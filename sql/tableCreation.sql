create database event_db;
use event_db;

create table events(
	event_id int auto_increment,
	event_name varchar(50),
    capacity int,
    time timestamp,
    duration time,
    constraint pk_events primary key(event_id)
);

create table person(
	id int auto_increment,
    name varchar(50),
    designation varchar(50),
    constraint pk_person primary key(id)
);

create table wait_list(
	person_id int,
    event_id int,
	designation varchar(50),
    time timestamp,
	constraint pk_wl primary key(event_id, person_id),
    constraint fk_events_wl foreign key(event_id) references events(event_id),
	constraint fk_people_wl foreign key(person_id) references person(id)
);

create table bookings(
	event_id int,
    person_id int,
    booking_id varchar(36) default (uuid()),
    constraint pk_bookings primary key(event_id, person_id, booking_id),
    constraint fk_events foreign key(event_id) references events(event_id),
	constraint fk_people foreign key(person_id) references person(id)
);