DROP TABLE IF EXISTS evolucao_internamento;
DROP TABLE IF EXISTS alertas;
DROP TABLE IF EXISTS leituras_telemetria;
DROP TABLE IF EXISTS veterinario_animais;
DROP TABLE IF EXISTS internamentos;
DROP TABLE IF EXISTS consultas;
DROP TABLE IF EXISTS disponibilidades;
DROP TABLE IF EXISTS veterinarios;

CREATE TABLE IF NOT EXISTS tutors (
  id CHAR(36) NOT NULL PRIMARY KEY,
  name VARCHAR(120) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS animals (
  id CHAR(36) NOT NULL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  species VARCHAR(80) NULL,
  breed VARCHAR(80) NULL,
  birth_date DATE NULL,
  weight DECIMAL(6,2) NULL,
  microchip VARCHAR(64) NULL,
  clinical_summary TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tutor_animals (
  tutor_id CHAR(36) NOT NULL,
  animal_id CHAR(36) NOT NULL,
  PRIMARY KEY (tutor_id, animal_id),
  CONSTRAINT fk_tutor_animals_tutor FOREIGN KEY (tutor_id) REFERENCES tutors(id) ON DELETE CASCADE,
  CONSTRAINT fk_tutor_animals_animal FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS clinical_records (
  id CHAR(36) NOT NULL PRIMARY KEY,
  animal_id CHAR(36) NOT NULL,
  type ENUM('consultation', 'exam', 'record') NOT NULL,
  recorded_at DATETIME NOT NULL,
  description TEXT NULL,
  veterinarian VARCHAR(120) NULL,
  CONSTRAINT fk_clinical_records_animal FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS veterinarios (
  id CHAR(36) NOT NULL PRIMARY KEY,
  name VARCHAR(120) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS disponibilidades (
  id CHAR(36) NOT NULL PRIMARY KEY,
  veterinario_id CHAR(36) NOT NULL,
  data_hora DATETIME NOT NULL,
  CONSTRAINT fk_disponibilidades_veterinario FOREIGN KEY (veterinario_id) REFERENCES veterinarios(id) ON DELETE CASCADE,
  UNIQUE KEY uq_disponibilidade_slot (veterinario_id, data_hora)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS consultas (
  id CHAR(36) NOT NULL PRIMARY KEY,
  disponibilidade_id CHAR(36) NULL,
  animal_id CHAR(36) NOT NULL,
  veterinario_id CHAR(36) NOT NULL,
  tutor_id CHAR(36) NOT NULL,
  data_hora DATETIME NOT NULL,
  motivo VARCHAR(255) NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_consultas_disponibilidade FOREIGN KEY (disponibilidade_id) REFERENCES disponibilidades(id) ON DELETE SET NULL,
  CONSTRAINT fk_consultas_animal FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE,
  CONSTRAINT fk_consultas_veterinario FOREIGN KEY (veterinario_id) REFERENCES veterinarios(id) ON DELETE CASCADE,
  CONSTRAINT fk_consultas_tutor FOREIGN KEY (tutor_id) REFERENCES tutors(id) ON DELETE CASCADE,
  UNIQUE KEY uq_consulta_disponibilidade (disponibilidade_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS internamentos (
  id CHAR(36) NOT NULL PRIMARY KEY,
  animal_id CHAR(36) NOT NULL,
  estado VARCHAR(40) NOT NULL,
  equipa_responsavel VARCHAR(255) NULL,
  previsao_alta DATETIME NULL,
  previsao_alta_observacoes VARCHAR(255) NULL,
  dispositivo_iot_ativo TINYINT(1) NOT NULL DEFAULT 0,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_internamento_animal (animal_id),
  CONSTRAINT fk_internamento_animal FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS veterinario_animais (
  veterinario_id CHAR(36) NOT NULL,
  animal_id CHAR(36) NOT NULL,
  PRIMARY KEY (veterinario_id, animal_id),
  CONSTRAINT fk_vet_animais_veterinario FOREIGN KEY (veterinario_id) REFERENCES veterinarios(id) ON DELETE CASCADE,
  CONSTRAINT fk_vet_animais_animal FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS leituras_telemetria (
  id CHAR(36) NOT NULL PRIMARY KEY,
  animal_id CHAR(36) NOT NULL,
  recolhida_em DATETIME NOT NULL,
  temperatura DECIMAL(5,2) NOT NULL,
  frequencia_cardiaca INT NOT NULL,
  frequencia_respiratoria INT NOT NULL,
  sinais_vitais TEXT NULL,
  CONSTRAINT fk_leitura_animal FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE,
  UNIQUE KEY uq_leitura_animal_recolha (animal_id, recolhida_em)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS alertas (
  id CHAR(36) NOT NULL PRIMARY KEY,
  animal_id CHAR(36) NOT NULL,
  tipo VARCHAR(40) NOT NULL,
  parametro VARCHAR(40) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  limiar DECIMAL(10,2) NOT NULL,
  detetado_em DATETIME NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  CONSTRAINT fk_alertas_animal FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE,
  UNIQUE KEY uq_alerta_evento (animal_id, tipo, detetado_em)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS evolucao_internamento (
  id CHAR(36) NOT NULL PRIMARY KEY,
  animal_id CHAR(36) NOT NULL,
  registado_em DATETIME NOT NULL,
  estado VARCHAR(40) NOT NULL,
  descricao TEXT NULL,
  CONSTRAINT fk_evolucao_animal FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE,
  UNIQUE KEY uq_evolucao_animal_registo (animal_id, registado_em)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
