drop table if exists produse;
drop type if exists categorii cascade;
drop type if exists tipuri_produse cascade;
drop type if exists culori cascade;

create type categorii as enum('Strategie', 'Aventura', 'Actiune', 'Simulator', 'Horror', 'Gaming', 'Office');
create type tipuri_produse as enum('joc', 'dlc', 'tastatura', 'mouse');
create type culori as enum('negru', 'alb', 'rosu', 'albastru');

create table if not exists produse(
	id serial primary key,
	nume varchar(60) unique not null,
	descriere text,
	pret numeric(8, 2) not null,
	nota numeric(4, 2),
	pentru_minori bool,
	tip_produs tipuri_produse default 'joc',
	categorie categorii,
	imagine varchar(300),
	data_aparitie timestamp default current_timestamp,
	culoare culori,
	caracteristici varchar []
);

INSERT INTO produse(nume, pret, nota, pentru_minori, caracteristici, imagine, data_aparitie, descriere, categorie)
VALUES 
('Assetto Corsa Evo', 59.99, 8.7, true, ARRAY['masini', 'circuit', 'simulator'], '/resources/img/produse/ac_evo/ac_evo.png',
'2024-06-10', 'Sim racer realist cu masini de top si circuite oficiale.', 'Simulator'),
('Assassin''s Creed Origins', 39.99, 8.5, false, ARRAY['egipt', 'open world', 'actiune'], '/resources/img/produse/ac_origins/ac_origins.png',
'2017-10-27', 'Exploreaza Egiptul antic in pielea primului asasin.', 'Aventura'),
('Age of Empires IV', 49.99, 9.0, true, ARRAY['strategie', 'istorie', 'multiplayer'], '/resources/img/produse/aoe4/aoe4.png',
'2021-10-28', 'Joc de strategie in timp real cu civilizatii istorice.', 'Strategie'),
('The Binding of Isaac: Rebirth', 19.99, 8.9, false, ARRAY['roguelike', 'singleplayer'], '/resources/img/produse/boi/boi.png',
'2014-11-04', 'Dungeon crawler intens si bizar cu niveluri generate random.', 'Aventura'),
('Cities: Skylines', 29.99, 9.2, true, ARRAY['simulare', 'constructie', 'urban'], '/resources/img/produse/cities_skylines/cities_skylines.png',
'2015-03-10', 'Construieste si administreaza propriul tau oras modern.', 'Simulator'),
('Counter-Strike 2', 9.99, 9.1, false, ARRAY['shooter', 'multiplayer', 'competitive'], '/resources/img/produse/cs2/cs2.png',
'2023-09-27', 'Shooter tactic competitiv intre teroristi si antiteroristi.', 'Actiune'),
('Dead by Daylight', 24.99, 8.0, false, ARRAY['horror', 'multiplayer', 'survivor'], '/resources/img/produse/dbd/dbd.png',
'2016-06-14', 'Joc de groaza asimetric cu 1 criminal si 4 supravietuitori.', 'Horror'),
('Dishonored', 19.99, 8.6, false, ARRAY['stealth', 'fantezie', 'actiune'], '/resources/img/produse/dishonored/dishonored.png',
'2012-10-09', 'Actiune stealth cu puteri supranaturale intr-un univers victorian.', 'Actiune'),
('Europa Universalis IV', 49.99, 8.8, true, ARRAY['istorie', 'strategie', 'diplomatie'], '/resources/img/produse/eu4/eu4.png',
'2013-08-13', 'Simularea geopoliticii mondiale intre anii 1444 si 1821.', 'Strategie'),
('Fallout 76', 39.99, 7.5, false, ARRAY['post-apocaliptic', 'open world', 'multiplayer'], '/resources/img/produse/fallout76/fallout76.png',
'2018-11-14', 'Supravietuieste si reconstruieste America post-nucleara online.', 'Aventura'),
('Grand Theft Auto IV', 14.99, 8.3, false, ARRAY['crima', 'open world', 'actiune'], '/resources/img/produse/gta4/gta4.png',
'2008-04-29', 'Exploreaza Liberty City in pielea unui imigrant est-european.', 'Actiune'),
('Grand Theft Auto V', 29.99, 9.5, false, ARRAY['crima', 'multiplayer', 'open world'], '/resources/img/produse/gta5/gta5.png',
'2013-09-17', 'Joc open world cu trei personaje si actiune non-stop in Los Santos.', 'Actiune'),
('Hearts of Iron IV', 39.99, 8.4, true, ARRAY['strategie', 'WW2', 'tactica'], '/resources/img/produse/hoi4/hoi4.png',
'2016-06-06', 'Controleaza o tara in Al Doilea Razboi Mondial si rescrie istoria.', 'Strategie'),
('Minecraft', 26.95, 9.6, true, ARRAY['constructie', 'survival', 'crafting'], '/resources/img/produse/minecraft/minecraft.png',
'2011-11-18', 'Construieste, mineaza si supravietuieste intr-o lume cubica.', 'Aventura'),
('Prison Architect', 29.99, 8.1, true, ARRAY['simulare', 'inchisoare', 'strategie'], '/resources/img/produse/prison_architect/prison_architect.png',
'2015-10-06', 'Construieste si gestioneaza o inchisoare de maxima securitate.', 'Simulator'),
('Red Dead Redemption 2', 59.99, 9.8, false, ARRAY['vestul salbatic', 'open world', 'poveste'], '/resources/img/produse/rdr2/rdr2.png',
'2018-10-26', 'Un western epic cu o poveste emotionala si peisaje uimitoare.', 'Aventura'),
('Split Fiction', 49.99, 9.7, false, ARRAY['fictiune', '3D', 'aventura'], '/resources/img/produse/split_fiction/split_fiction.png',
'2025-03-06', 'Aventura 3D cu elemente de puzzle, fantezie si sci-fi.', 'Aventura'),
('Terraria', 9.99, 9.0, true, ARRAY['crafting', 'aventura', 'pixel art'], '/resources/img/produse/terraria/terraria.png', '2011-05-16',
 'Exploreaza, lupta si construieste intr-o lume 2D vasta.', 'Aventura'),
('The Witcher 3: Wild Hunt', 39.99, 9.7, false, ARRAY['rpg', 'fantezie', 'open world'], '/resources/img/produse/witcher3/witcher3.png',
'2015-05-19', 'Joc RPG premiat cu povesti mature si un univers fantastic.', 'Aventura');

INSERT INTO produse (nume, pret, nota, pentru_minori, caracteristici, imagine, data_aparitie, descriere, categorie, tip_produs)
VALUES 
('The Witcher 3: Blood and Wine', 19.99, 9.6, false, ARRAY['expansiune', 'poveste', 'rpg'], '/resources/img/produse/witcher3/witcher3.png',
'2016-05-31', 'Expansiune masiva cu o noua regiune si o poveste captivanta.', 'Aventura', 'dlc'),
 ('GTA 4: The Lost and Damned', 9.99, 8.4, false, ARRAY['biker', 'actiune', 'poveste'], '/resources/img/produse/gta4/gta4.png',
 '2009-02-17', 'Urmareste povestea unei bande de motociclisti din Liberty City.', 'Actiune', 'dlc'),
 ('Hearts of Iron IV: No Step Back', 14.99, 8.8, true, ARRAY['strategie', 'WW2', 'expansiune'], '/resources/img/produse/hoi4/hoi4.png',
 '2021-11-23', 'Imbunatatiri pentru frontul de est si logistica militara.', 'Strategie', 'dlc'),
 ('Cities: Skylines - Mass Transit', 12.99, 8.9, true, ARRAY['transport', 'simulare', 'orase'], '/resources/img/produse/cities_skylines/cities_skylines.png',
 '2017-05-18', 'Adauga mijloace de transport in comun si infrastructura complexa.', 'Simulator', 'dlc'),
 ('Dead by Daylight: Silent Hill Chapter', 11.99, 8.1, false, ARRAY['horror', 'silent hill', 'killer nou'], '/resources/img/produse/dbd/dbd.png',
 '2020-06-16', 'Adauga personajele din Silent Hill intr-un nou capitol de groaza.', 'Horror', 'dlc');

INSERT INTO produse (nume, pret, nota, pentru_minori, caracteristici, imagine, data_aparitie, descriere, categorie, culoare, tip_produs)
VALUES 
('Logitech G Pro X', 139.99, 9.1, true, ARRAY['gaming', 'mecanica', 'switch-uri schimbabile'], '/resources/img/produse/g_pro_x/g_pro_x.png',
'2021-10-12', 'Tastatura mecanica profesionista pentru esports cu switch-uri interschimbabile.', 'Gaming', 'negru', 'tastatura'),

('Razer BlackWidow V4', 169.99, 9.3, true, ARRAY['rgb', 'mecanica', 'razer green switches'], '/resources/img/produse/blackwidow_v4/blackwidow_v4.png',
'2023-03-10', 'Tastatura mecanica cu iluminare RGB si taste macro dedicate.', 'Gaming', 'negru', 'tastatura'),

('SteelSeries Apex 3', 59.99, 8.5, true, ARRAY['silentioasa', 'rgb', 'rezistenta la apa'], '/resources/img/produse/apex_3/apex_3.png',
'2020-01-15', 'Tastatura silentioasa si rezistenta la apa, ideala pentru gaming casual.', 'Gaming', 'negru', 'tastatura'),

('Logitech K380', 39.99, 8.7, true, ARRAY['wireless', 'compacta', 'bluetooth'], '/resources/img/produse/k380/k380.png',
'2019-08-20', 'Tastatura compacta wireless ideala pentru birou si mobilitate.', 'Office', 'alb', 'tastatura');

INSERT INTO produse (nume, pret, nota, pentru_minori, caracteristici, imagine, data_aparitie, descriere, categorie, culoare, tip_produs)
VALUES 
('Logitech G502 X', 79.99, 9.4, true, ARRAY['gaming', 'dpi ridicat', 'ergonomic'], '/resources/img/produse/g502x/g502x.png',
'2022-09-01', 'Mouse de gaming cu senzor optic avansat si design ergonomic.', 'Gaming', 'alb', 'mouse'),

('Razer DeathAdder V2', 69.99, 9.0, true, ARRAY['ergonomic', 'dpi 20000', 'switch optic'], '/resources/img/produse/deathadder_v2/deathadder_v2.png',
'2020-02-15', 'Mouse cu forma ergonomica, ideal pentru sesiuni lungi de joc.', 'Gaming', 'negru', 'mouse'),

('SteelSeries Rival 3', 39.99, 8.5, true, ARRAY['rgb', 'usor', 'gaming entry level'], '/resources/img/produse/rival_3/rival_3.png',
'2020-03-01', 'Mouse de gaming accesibil, cu iluminare RGB si senzor precis.', 'Gaming', 'negru', 'mouse'),

('Logitech MX Master 3S', 99.99, 9.6, true, ARRAY['wireless', 'productivitate', 'silentios'], '/resources/img/produse/mx_master_3s/mx_master_3s.png',
'2022-05-25', 'Mouse premium pentru birou cu scroll rapid si design ergonomic.', 'Office', 'negru', 'mouse');

GRANT ALL PRIVILEGES ON DATABASE proiect TO stefan;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO stefan;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO stefan;
