DELETE FROM clinical_records;
DELETE FROM tutor_animals;
DELETE FROM animals;
DELETE FROM tutors;

INSERT INTO tutors (id, name) VALUES
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Tutor Ana'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'Tutor Bruno');

INSERT INTO animals (id, name, species, breed, birth_date, weight, microchip, clinical_summary) VALUES
  ('11111111-1111-4111-8111-111111111111', 'Luna', 'Canino', 'Labrador', '2021-04-12', 24.50, 'MICRO-0001', 'Cão ativo, sem alterações clínicas relevantes.'),
  ('22222222-2222-4222-8222-222222222222', 'Milo', 'Felino', 'Europeu', '2020-08-03', 5.20, 'MICRO-0002', 'Gato sob observação clínica.');

INSERT INTO tutor_animals (tutor_id, animal_id) VALUES
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '11111111-1111-4111-8111-111111111111'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', '22222222-2222-4222-8222-222222222222');

INSERT INTO clinical_records (id, animal_id, type, recorded_at, description, veterinarian) VALUES
  ('33333333-3333-4333-8333-333333333333', '11111111-1111-4111-8111-111111111111', 'consultation', '2026-01-10 09:30:00', 'Consulta de rotina', 'Dra. Marta'),
  ('44444444-4444-4444-8444-444444444444', '11111111-1111-4111-8111-111111111111', 'exam', '2026-02-05 14:15:00', 'Hemograma completo', 'Dr. Pedro'),
  ('55555555-5555-4555-8555-555555555555', '11111111-1111-4111-8111-111111111111', 'record', '2026-03-01 11:00:00', 'Vacinação anual', 'Dra. Marta'),
  ('66666666-6666-4666-8666-666666666666', '22222222-2222-4222-8222-222222222222', 'consultation', '2026-02-20 16:45:00', 'Consulta de acompanhamento', 'Dra. Marta');
