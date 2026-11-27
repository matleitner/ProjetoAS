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
