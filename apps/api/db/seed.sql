DELETE FROM evolucao_internamento;
DELETE FROM alertas;
DELETE FROM leituras_telemetria;
DELETE FROM veterinario_animais;
DELETE FROM internamentos;
DELETE FROM consultas;
DELETE FROM clinical_records;
DELETE FROM tutor_animals;
DELETE FROM disponibilidades;
DELETE FROM veterinarios;
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

INSERT INTO veterinarios (id, name) VALUES
  ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'Dra. Marta'),
  ('dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'Dr. Pedro');

INSERT INTO disponibilidades (id, veterinario_id, data_hora) VALUES
  ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', '2026-12-10 09:00:00'),
  ('ffffffff-ffff-4fff-8fff-ffffffffffff', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', '2026-12-10 10:00:00'),
  ('01010101-0101-4101-8101-010101010101', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', '2026-12-11 11:00:00'),
  ('02020202-0202-4202-8202-020202020202', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', '2026-12-11 09:00:00'),
  ('03030303-0303-4303-8303-030303030303', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', '2026-12-12 14:00:00'),
  ('04040404-0404-4404-8404-040404040404', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', '2026-12-13 15:00:00'),
  ('05050505-0505-4505-8505-050505050505', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', '2026-12-13 15:15:00');


INSERT INTO internamentos (id, animal_id, estado, equipa_responsavel, previsao_alta, previsao_alta_observacoes, dispositivo_iot_ativo) VALUES
  ('99999999-9999-4999-8999-999999999999', '11111111-1111-4111-8111-111111111111', 'internado', 'Dra. Marta', '2026-12-01 12:00:00', 'Alta prevista após estabilização dos sinais vitais.', 1);

INSERT INTO veterinario_animais (veterinario_id, animal_id) VALUES
  ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', '11111111-1111-4111-8111-111111111111');

INSERT INTO leituras_telemetria (id, animal_id, recolhida_em, temperatura, frequencia_cardiaca, frequencia_respiratoria, sinais_vitais) VALUES
  ('aaaaaaa1-aaaa-4aaa-8aaa-aaaaaaaaaaa1', '11111111-1111-4111-8111-111111111111', '2026-11-27 10:00:00', 38.50, 92, 24, '{"origem":"sensor-iot"}'),
  ('aaaaaaa2-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '11111111-1111-4111-8111-111111111111', '2026-11-27 10:05:00', 38.60, 94, 25, '{"origem":"sensor-iot"}'),
  ('aaaaaaa3-aaaa-4aaa-8aaa-aaaaaaaaaaa3', '11111111-1111-4111-8111-111111111111', '2026-11-27 10:10:00', 38.70, 96, 26, '{"origem":"sensor-iot"}');


INSERT INTO evolucao_internamento (id, animal_id, registado_em, estado, descricao) VALUES
  ('bbbbbbb1-bbbb-4bbb-8bbb-bbbbbbbbbbb1', '11111111-1111-4111-8111-111111111111', '2026-11-26 08:00:00', 'internado', 'Internamento iniciado para observação e estabilização.'),
  ('bbbbbbb2-bbbb-4bbb-8bbb-bbbbbbbbbbb2', '11111111-1111-4111-8111-111111111111', '2026-11-27 09:00:00', 'internado', 'Sinais vitais estáveis; mantida monitorização IoT.');
