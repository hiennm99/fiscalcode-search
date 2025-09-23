-- `cvs-bigdata`.prod__cvs__serving_area__1.entities definition

-- Drop table

-- DROP TABLE entities;

CREATE TABLE entities (
	fiscal_code STRING(65535),
	record_id STRING(65535),
	source_system STRING(65535),
	collected_date TIMESTAMP,
	created_date TIMESTAMP,
	is_company BOOLEAN,
	name STRING(65535),
	gender STRING(65535),
	date_of_birth DATE,
	country_of_birth STRING(65535),
	region_of_birth STRING(65535),
	province_of_birth STRING(65535),
	city_of_birth STRING(65535),
	is_deceased BOOLEAN,
	date_of_death STRING(65535),
	entity_notes STRING(65535)
);

-- `cvs-bigdata`.prod__cvs__serving_area__1.guarantors definition

-- Drop table

-- DROP TABLE guarantors;

CREATE TABLE guarantors (
	fiscal_code STRING(65535),
	record_id STRING(65535),
	source_system STRING(65535),
	collected_date TIMESTAMP,
	created_date TIMESTAMP,
	is_company BOOLEAN,
	name STRING(65535),
	gender STRING(65535),
	date_of_birth DATE,
	country_of_birth STRING(65535),
	region_of_birth STRING(65535),
	province_of_birth STRING(65535),
	city_of_birth STRING(65535),
	is_deceased BOOLEAN,
	date_of_death STRING(65535),
	entity_notes STRING(65535)
);

-- `cvs-bigdata`.prod__cvs__serving_area__1.addresses definition

-- Drop table

-- DROP TABLE addresses;

CREATE TABLE addresses (
	fiscal_code STRING(65535),
	record_id STRING(65535),
	source_system STRING(65535),
	collected_date TIMESTAMP,
	created_date TIMESTAMP,
	origin_province STRING(65535),
	origin_city STRING(65535),
	origin_street STRING(65535),
	address_type STRING(65535),
	street STRING(65535),
	locality STRING(65535),
	city STRING(65535),
	province STRING(65535),
	region STRING(65535),
	postcode STRING(65535),
	country STRING(65535),
	similar_score FLOAT64,
	address_notes STRING(65535),
	rn INT64
);

-- `cvs-bigdata`.prod__cvs__serving_area__1.contacts definition

-- Drop table

-- DROP TABLE contacts;

CREATE TABLE contacts (
	fiscal_code STRING(65535),
	record_id STRING(65535),
	source_system STRING(65535),
	collected_date TIMESTAMP,
	created_date TIMESTAMP,
	email STRING(65535),
	is_pec BOOLEAN,
	is_verified BOOLEAN,
	phone_number STRING(65535)
);

-- `cvs-bigdata`.prod__cvs__serving_area__1.banks definition

-- Drop table

-- DROP TABLE banks;

CREATE TABLE banks (
	fiscal_code STRING(65535),
	record_id STRING(65535),
	source_system STRING(65535),
	collected_date TIMESTAMP,
	created_date TIMESTAMP,
	bank_abi STRING(65535),
	bank_cab STRING(65535),
	bank_name STRING(65535),
	account_number STRING(65535)
);

-- `cvs-bigdata`.prod__cvs__serving_area__1.jobs definition

-- Drop table

-- DROP TABLE jobs;

CREATE TABLE jobs (
	fiscal_code STRING(65535),
	source_system STRING(65535),
	collected_date TIMESTAMP,
	created_date TIMESTAMP,
	job_position INT64,
	job_employer_phone STRING(65535),
	job_start_date DATE,
	job_end_date STRING(65535),
	job_pension_category STRING(65535),
	job_employer_tax_code STRING(65535),
	job_employer_fax STRING(65535),
	job_income_range STRING(65535),
	job_reference INT64,
	job_employer_vat_number INT64,
	job_monthly_income FLOAT64,
	job_work_activity_notes STRING(65535),
	job_employer_name STRING(65535),
	job_legal_street_type STRING(65535),
	job_legal_street STRING(65535),
	job_legal_address STRING(65535),
	job_legal_street_number STRING(65535),
	job_legal_city STRING(65535),
	job_legal_province STRING(65535),
	job_legal_postcode INT64,
	job_operation_street_type STRING(65535),
	job_operation_street_number STRING(65535),
	job_operation_street STRING(65535),
	job_operation_address STRING(65535),
	job_operation_postcode FLOAT64,
	job_operation_province STRING(65535),
	job_operation_city STRING(65535),
	finance_position INT64,
	finance_supplier_evaluation STRING(65535),
	finance_ongoing_transfers STRING(65535),
	finance_ongoing_garnishments STRING(65535),
	finance_bank_account STRING(65535),
	finance_garnishment_notes STRING(65535),
	finance_transfer_amount FLOAT64,
	finance_transfer_notes STRING(65535),
	finance_transfer_expiry STRING(65535),
	finance_garnishment_amount FLOAT64,
	finance_garnishment_expiry STRING(65535)
);