
insert into events(event_name, capacity, time, duration)
values('Type A', 50, '2022-08-18 09:00:00', '02:00');

insert into events(event_name, capacity, time, duration)
values('Type B', 50, '2022-08-18 10:00:00', '01:00');

insert into events(event_name, capacity, time, duration)
values('PPT', 75, '2022-08-19 01:00:00', '02:00');

insert into person(name, designation)
values('Aaditya', 'Student');

insert into person(name, designation)
values('Bimal', 'Special Guest');

insert into person(name, designation)
values('Anmol', 'Professor');

insert into person(name, designation)
values('Akil Raj', 'Business Person');

insert into bookings(event_id, person_id)
values(2, 1);
